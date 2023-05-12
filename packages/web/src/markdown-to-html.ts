import rehypeDomStringify from 'rehype-dom-stringify';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const pipeline = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSanitize)
  .use(rehypeDomStringify);

export const markdownToHtml = async (markdown: string) => {
  const vfile = await pipeline.process(markdown);
  return vfile.toString();
};
