import { FC } from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import {
  createTOC,
  fenceNode,
  headingNode,
  MarkdocLayout,
  noteTag,
  playgroundTag,
} from '@/components/layouts/MarkdocLayout';

export const getStaticProps: GetStaticProps = async (context) => {
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
  return <MarkdocLayout content={JSON.parse(content)} toc={toc} />;
};

export default DocsPage;
