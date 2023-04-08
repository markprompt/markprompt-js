import { FC } from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import {
  collapseGroupTag,
  collapseTag,
  createTOC,
  fenceNode,
  headingNode,
  MarkdocLayout,
  noteTag,
  playgroundTag,
} from '@/components/layouts/MarkdocLayout';
import { SharedHead } from '@/components/pages/SharedHead';

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(
    `https://api.motif.land/v1/exports/raw/${process.env.MOTIF_DOCS_PAGE_ID}`,
  );
  const rawText = await res.text();
  const ast = Markdoc.parse(rawText);
  const config = {
    nodes: {
      fence: fenceNode,
      heading: headingNode,
    },
    tags: {
      playground: playgroundTag,
      note: noteTag,
      collapsegroup: collapseGroupTag,
      collapse: collapseTag,
    },
  };

  const content = Markdoc.transform(ast, config);
  const toc = createTOC(content);

  return {
    props: { content: JSON.stringify(content), toc },
    revalidate: 60,
  };
};

const DocsPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  content,
  toc,
}) => {
  return (
    <>
      <SharedHead
        title="Markprompt | Open Source GPT-4 platform for Markdown"
        coverUrl="https://markprompt.com/static/cover-docs.png"
      />
      <MarkdocLayout content={JSON.parse(content)} toc={toc} />
    </>
  );
};

export default DocsPage;
