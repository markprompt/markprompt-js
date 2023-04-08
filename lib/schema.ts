import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';

export type MarkpromptConfigType = {
  include?: string[];
  exclude?: string[];
};

export const DEFAULT_MARKPROMPT_CONFIG = `{
  "include": [
    "**/*.md",
    "**/*.mdoc",
    "**/*.mdx",
    "**/*.html",
    "**/*.txt"
  ],
  "exclude": []
}`;

export const MARKPROMPT_CONFIG_SCHEMA: JTDSchemaType<MarkpromptConfigType> = {
  optionalProperties: {
    include: { elements: { type: 'string' } },
    exclude: { elements: { type: 'string' } },
  },
};

const ajv = new Ajv();

export const parse = ajv.compileParser(MARKPROMPT_CONFIG_SCHEMA);
