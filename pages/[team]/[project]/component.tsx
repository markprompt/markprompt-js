import { ProjectSettingsLayout } from '@/components/layouts/ProjectSettingsLayout';
import { Code } from '@/components/ui/Code';
import { copyToClipboard } from '@/lib/utils';
import { ClipboardIcon } from '@radix-ui/react-icons';
import { Language } from 'prism-react-renderer';
import { toast } from 'react-hot-toast';
import { Playground } from '@/components/files/Playground';
import { useState } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/router';
import useTeam from '@/lib/hooks/use-team';
import useProject from '@/lib/hooks/use-project';

const motifCode = `
import { Markprompt } from "https://esm.sh/markprompt"

<Markprompt projectKey="<project-key>" />
`.trim();

const jsxCode = `
import { Markprompt } from "markprompt"

function MyPrompt() {
  return <Markprompt projectKey="<project-key>" />
}
`.trim();

const tokenCode = `
<Markprompt token="<PROJECT_ACCESS_TOKEN>" />
`.trim();

const propsExample = `
<Markprompt
  projectKey="<project-key>"
  iDontKnowMessage="Sorry, I don't know!"
  placeholder="Ask Acme docs..."
/>
`.trim();

const curlCode = `
curl -L \\
  -H "Authorization: Bearer <TOKEN>" \\
  -d '{"prompt":"How do I self-host a database?"}'
  https://api.markprompt.com/completions
`.trim();

const streamingCode = `
const res = await fetch('https://api.markprompt.com/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: "How do I self-host a database?",
    iDontKnowMessage: "I don't know",
  }),
});

if (!res.ok || !res.body) {
  console.error('Error:', await res.text());
  return;
}

const reader = res.body.getReader();
const decoder = new TextDecoder();
let response = '';

while (true) {
  const { value, done } = await reader.read();
  const chunk = decoder.decode(value);
  response = response + chunk;
  if (done) {
    break;
  }
}

const parts = response.split('___START_RESPONSE_STREAM___')

console.info("Answer:", parts[1])
console.info("References:", parts[0])
`.trim();

const npmCode = `npm install markprompt`.trim();

const DocsCode = ({ code, language }: { code: string; language: Language }) => {
  return (
    <div className="not-prose relative mb-6 w-full rounded-lg border border-neutral-900 bg-neutral-1000 p-4 text-sm">
      <Code language={language} code={code} />
      <div className="absolute right-[12px] top-[12px]">
        <div
          className="cursor-pointer rounded p-2 transition dark:hover:bg-neutral-900"
          onClick={() => {
            copyToClipboard(code);
            toast.success('Copied!');
          }}
        >
          <ClipboardIcon className="h-4 w-4 text-neutral-500" />
        </div>
      </div>
    </div>
  );
};

const ComponentPage = () => {
  const { team } = useTeam();
  const { project } = useProject();
  const [promptOpen, setPromptOpen] = useState(false);
  const router = useRouter();

  if (!team || !project) {
    return <></>;
  }

  return (
    <ProjectSettingsLayout width="md" title="Component">
      <div className="doc pb-12">
        <p className="text-lg text-neutral-500">
          The Markprompt React component offers a simple way to add a chat
          prompt to your website, with just a few lines of code.
        </p>
        <div className="relative mt-8 mb-12 flex h-[500px] w-full items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600">
          <button
            onClick={() => setPromptOpen(true)}
            className="cursor-pointer rounded-lg bg-black/50 px-3 py-2 text-sm font-medium text-white transition hover:bg-black/60"
          >
            Open chat
          </button>
          {promptOpen && (
            <div
              className="absolute inset-0 z-0"
              onClick={() => {
                setPromptOpen(false);
              }}
            />
          )}
          <div
            className={cn(
              'absolute inset-16 rounded-xl border border-dashed bg-neutral-1000 px-8 py-4 opacity-0 dark:border-neutral-800',
              {
                'animate-prompt-window': promptOpen,
                'pointer-events-none': !promptOpen,
              },
            )}
          >
            <Playground />
          </div>
        </div>
        <h2>Installation and usage</h2>
        <h3>Motif</h3>
        <p>
          In{' '}
          <a
            className="subtle-underline"
            href="https://motif.land"
            target="_blank"
            rel="noreferrer"
          >
            Motif
          </a>
          , paste the following in an MDX, JSX or TSX file:
        </p>
        <DocsCode code={motifCode} language="jsx" />
        <p>
          replacing{' '}
          <code className="text-sm font-normal text-lime-400">
            &lt;project-key&gt;
          </code>{' '}
          is the public key associated to your project. It can be obtained in
          the project settings under &quot;Public API key&quot;.
        </p>
        <h3>Node</h3>
        <p>In Node, install Markprompt via NPM:</p>
        <DocsCode code={npmCode} language="bash" />
        <p>
          In your React application, paste the following in an MDX, JSX or TSX
          file:
        </p>
        <DocsCode code={jsxCode} language="jsx" />
        <p>
          replacing{' '}
          <code className="text-sm font-normal text-lime-400">
            &lt;project-key&gt;
          </code>{' '}
          is the public key associated to your project. It can be obtained in
          the project settings under &quot;Public API key&quot;.
        </p>
        <h3>Whitelisting your domain</h3>
        <p>
          Then, head over to the project settings and{' '}
          <Link
            className="subtle-underline"
            href={`/${router.query?.team}/${router.query?.project}/settings`}
          >
            add a whitelisted domain
          </Link>{' '}
          where your site will be hosted. This will allow the component to speak
          to the Markprompt API endpoint for completions, and prevent misuse
          from other origins.
        </p>
        <div className="mb-8">
          <div className="flex justify-start">
            <Button
              buttonSize="sm"
              variant="cta"
              asLink
              href={`/${team.slug}/${project.slug}/settings`}
            >
              Add whitelisted domain →
            </Button>
          </div>
        </div>
        <h3>Alternative: using an authorization token</h3>
        <p>
          If you cannot use a whitelisted domain, for instance when developing
          on localhost, you can alternatively pass an authorization token:
        </p>
        <DocsCode code={tokenCode} language="jsx" />
        <p>
          You can obtain this token in the{' '}
          <Link
            className="subtle-underline"
            href={`/${router.query?.team}/${router.query?.project}/settings`}
          >
            project settings
          </Link>
          . This token is tied to a specific project, so adding the `project`
          prop will not have any effect.
        </p>
        <div className="mb-6 rounded-md border border-orange-900/50 bg-orange-900/10 p-4 text-sm text-orange-700">
          Make sure to keep this token private, and never publish code that
          exposes it. If your token has been compromised, you can generate a new
          one in the settings.
        </div>
        <h3>Styling</h3>
        <p className="mb-8">
          Currently, the Markprompt component is styled using{' '}
          <a
            className="subtle-underline"
            href="https://tailwindcss.com"
            target="_blank"
            rel="noreferrer"
          >
            Tailwind CSS
          </a>
          , and therefore requires a working Tailwind configuration. We are
          planning to make it headless, for more flexible options.
        </p>
        <h3>API access</h3>
        <p>You can pass the following props to the component:</p>
        <table className="prose prose-invert">
          <thead>
            <tr>
              <th className="text-left text-neutral-300">Prop</th>
              <th className="text-left text-neutral-300">Default value</th>
              <th className="text-left text-neutral-300">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-neutral-500">
                <code className="font-normal text-cyan-400">
                  iDontKnowMessage
                </code>
              </td>
              <td className="text-neutral-500">
                Sorry, I am not sure how to answer that.
              </td>
              <td className="text-neutral-500">
                Fallback message in case no answer is found.
              </td>
            </tr>
            <tr>
              <td className="text-neutral-500">
                <code className="font-normal text-cyan-400">placeholder</code>
              </td>
              <td className="text-neutral-500">&#39;Ask me anything...&#39;</td>
              <td className="text-neutral-500">
                Message to show in the input box when no text has been entered.
              </td>
            </tr>
          </tbody>
        </table>
        <p>Example:</p>
        <DocsCode code={propsExample} language="jsx" />
        <h2>API access</h2>
        <p>
          If you want to build your own custom component, or use completions in
          another way, you can make an POST request to the following endpoint,
          passing in an authorization token that you can obtain in the{' '}
          <Link
            className="subtle-underline"
            href={`/${router.query?.team}/${router.query?.project}/settings`}
          >
            project settings
          </Link>
          :
        </p>
        <DocsCode code={curlCode} language="bash" />
        <p>
          This will return a{' '}
          <a
            className="subtle-underline"
            href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream"
            target="_blank"
            rel="noreferrer"
          >
            ReadableSteam
          </a>{' '}
          serving completions in streaming chunks. Supported parameters are:
        </p>
        <div className="prose prose-invert py-4">
          <ul className="prose prose-invert">
            <li>
              <code>prompt</code>: The prompt to generate the completions for.
            </li>
            <li>
              <code>iDontKnowMessage</code>: (optional) The fallback message in
              case no completions were returned.
            </li>
          </ul>
        </div>
        <p>Here is an example in JavaScript:</p>
        <DocsCode code={streamingCode} language="typescript" />
      </div>
    </ProjectSettingsLayout>
  );
};

export default ComponentPage;
