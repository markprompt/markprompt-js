import Markdoc from '@markdoc/markdoc';
import { backOff } from 'exponential-backoff';
import type { Content, Root } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxFromMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { mdxjs } from 'micromark-extension-mdxjs';
import TurndownService from 'turndown';
import { u } from 'unist-builder';
import { filter } from 'unist-util-filter';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';

import { DbFile, Project, FileData } from '@/types/types';
import { getFileType } from '@/lib/utils';
import { extractFrontmatter } from '@/lib/utils.node';
import { createFile, getFileAtPath } from '@/lib/supabase';
import {
  getProjectEmbeddingsMonthTokenCountKey,
  getRedisClient,
} from '@/lib/redis';
import { MIN_CONTENT_LENGTH } from '@/lib/constants';
import { createEmbedding } from '@/lib/openai.edge';

type FileSectionData = {
  sections: string[];
  meta: any;
};

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

turndown.addRule('pre', {
  filter: 'pre',
  replacement: (content: string, node: any) => {
    const lang = node.getAttribute('data-language') || '';
    return `\n\n\`\`\`${lang}\n${content.trim()}\n\`\`\`\n\n`;
  },
});

const splitTreeBy = (tree: Root, predicate: (node: Content) => boolean) => {
  return tree.children.reduce<Root[]>((trees, node) => {
    const [lastTree] = trees.slice(-1);

    if (!lastTree || predicate(node)) {
      const tree: Root = u('root', [node]);
      return trees.concat(tree);
    }

    lastTree.children.push(node);
    return trees;
  }, []);
};

// Use `asMDX = false` for Markdoc content. What might happen in Markdoc
// is that the page contains a statement like `{HI_THERE}`, which is
// rendered verbatim in Markdown/Markdoc. It's also not a problem à priori
// for MDX, since it's semantically correct MDX (no eval is happening here).
// However, specifically for `{HI_THERE}` with an underscore, the Markdoc
// transform will escape the underscore, turning it into `{HI\_THERE}`, and
// then it's actually semantically incorrect MDX, because what goes inside the
// curly braces is treated as a variable/expression, and `HI\_THERE` is
// no a valid JS variable/expression, so the parsing will fail.
// Similarly, statements like "<10" are valid Markdown/Markdoc, but not
// valid MDX (https://github.com/micromark/micromark-extension-mdx-jsx/issues/7)
// and we don't want this to break Markdoc.
const splitMarkdownIntoSections = (
  content: string,
  asMDX: boolean,
): string[] => {
  const mdxTree = fromMarkdown(
    content,
    asMDX
      ? {
          extensions: [mdxjs()],
          mdastExtensions: [mdxFromMarkdown()],
        }
      : {},
  );

  // Remove all JSX and expressions from MDX
  const mdTree = filter(
    mdxTree,
    (node) =>
      ![
        'mdxjsEsm',
        'mdxJsxFlowElement',
        'mdxJsxTextElement',
        'mdxFlowExpression',
        'mdxTextExpression',
      ].includes(node.type),
  );

  if (!mdTree) {
    return [];
  }

  const sectionTrees = splitTreeBy(mdTree, (node) => node.type === 'heading');
  return sectionTrees.map((tree) => toMarkdown(tree));
};

const splitMarkdocIntoSections = (content: string): string[] => {
  const ast = Markdoc.parse(content);
  // In Markdoc, we make an exception and transform {% img %}
  // and {% image %} tags to <img> html since this is a common
  // use as an improvement to the ![]() Markdown tag. We could
  // offer to pass such rules via the API call.
  const transformed = Markdoc.transform(ast, {
    tags: {
      img: { render: 'img', attributes: { src: { type: String } } },
      image: { render: 'img', attributes: { src: { type: String } } },
    },
  });
  const html = Markdoc.renderers.html(transformed) || '';
  const md = turndown.turndown(html);
  return splitMarkdownIntoSections(md, false);
};

const processFile = (file: FileData): FileSectionData => {
  let sections: string[] = [];
  const meta = extractFrontmatter(file.content);
  const fileType = getFileType(file.name);
  if (fileType === 'mdoc') {
    sections = splitMarkdocIntoSections(file.content);
  } else {
    try {
      sections = splitMarkdownIntoSections(file.content, true);
    } catch (e) {
      // Some repos use the .md extension for Markdoc, and this
      // would break if parsed as MDX, so attempt with Markoc
      // parsing here.
      sections = splitMarkdocIntoSections(file.content);
    }
  }
  return { sections, meta };
};

export const generateFileEmbeddings = async (
  supabase: SupabaseClient,
  projectId: Project['id'],
  file: FileData,
) => {
  let embeddingsTokenCount = 0;
  let errors: { path: string; message: string }[] = [];

  const { meta, sections } = processFile(file);

  let fileId = await getFileAtPath(supabase, projectId, file.path);

  // Delete previous file section data
  if (fileId) {
    await supabase
      .from('file_sections')
      .delete()
      .filter('file_id', 'eq', fileId);
    await supabase.from('files').update({ meta }).eq('id', fileId);
  } else {
    fileId = await createFile(supabase, projectId, file.path, meta);
  }

  if (!fileId) {
    return [
      { path: file.path, message: `Unable to create file ${file.path}.` },
    ];
  }

  const embeddingsData: {
    file_id: DbFile['id'];
    content: string;
    embedding: unknown;
    token_count: number;
  }[] = [];

  for (const section of sections) {
    const input = section.replace(/\n/g, ' ');

    // Ignore content shorter than `MIN_CONTENT_LENGTH` characters.
    if (input.length < MIN_CONTENT_LENGTH) {
      continue;
    }

    try {
      // Retry with exponential backoff in case of error. Typical cause is
      // too_many_requests.
      const embeddingResult = await backOff(() => createEmbedding(input), {
        startingDelay: 1000,
        numOfAttempts: 2,
        // startingDelay: 10000,
        // numOfAttempts: 10,
      });

      embeddingsTokenCount += embeddingResult.usage?.total_tokens ?? 0;
      embeddingsData.push({
        file_id: fileId,
        content: section,
        embedding: embeddingResult.data[0].embedding,
        token_count: embeddingResult.usage.total_tokens ?? 0,
      });
    } catch (error) {
      const snippet = input.slice(0, 20);
      console.error('Error', error);
      errors.push({
        path: file.path,
        message: `Unable to generate embeddings for section starting with '${snippet}...': ${error}`,
      });
    }
  }

  const { error } = await supabase.from('file_sections').insert(embeddingsData);
  if (error) {
    console.error('Error storing embeddings:', error);
    // Too large? Attempt one embedding at a time.
    for (const data of embeddingsData) {
      await supabase.from('file_sections').insert([data]);
    }
  }

  await getRedisClient().incrby(
    getProjectEmbeddingsMonthTokenCountKey(projectId, new Date()),
    embeddingsTokenCount,
  );

  return errors;
};
