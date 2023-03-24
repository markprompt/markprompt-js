import { FC } from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';

type CodeProps = {
  code: string;
  language: Language;
  className?: string;
};

export const Code: FC<CodeProps> = ({ code, language, className }) => {
  return (
    <div className={className}>
      <Highlight {...defaultProps} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div key={`code-line-${i}`} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span
                    key={`code-line-${i}-${key}`}
                    {...getTokenProps({ token, key })}
                  />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};
