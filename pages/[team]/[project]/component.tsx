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
import { SUPPORTED_MODELS } from '@/types/types';

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
  projectKey="xxx...xxxx"
  model="gpt-4"
  iDontKnowMessage="Sorry, I don't know!"
  placeholder="Ask Acme docs..."
/>
`.trim();

const curlCode = `
curl -L \\
  -H "Authorization: Bearer <TOKEN>" \\
  -d '{"prompt":"How do I self-host a database?"}'
  https://api.markprompt.com/v1/completions
`.trim();

const streamingCode = `
const res = await fetch('https://api.markprompt.com/v1/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: "How do I self-host a database?",
    iDontKnowMessage: "I don't know",
    projectKey: <projectKey>
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

export const C = ({ v }: { v: string }) => {
  return (
    <code className="whitespace-nowrap rounded bg-neutral-900 px-1 py-0.5 text-xs font-normal text-neutral-400">
      {v}
    </code>
  );
};

const DocsCode = ({ code, language }: { code: string; language: Language }) => {
  return (
    <div className="not-prose relative mb-6 w-full rounded-lg border border-neutral-900 bg-neutral-1000 p-4 text-sm">
      <div className="overflow-x-auto">
        <Code language={language} code={code} />
      </div>
      <div className="absolute right-[12px] top-[12px] bg-neutral-1000/80 backdrop-blur">
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
            <Playground projectKey={project.private_dev_api_key} />
          </div>
        </div>
        <h2>Installation and usage</h2>
        <div className="mb-6 rounded-md border border-sky-900/50 bg-sky-900/30 p-4 text-sm text-sky-600">
          Check out the starter template for a fully working example:{' '}
          <a
            className="font-medium underline"
            href="https://github.com/motifland/markprompt-starter-template"
          >
            Markprompt starter template
          </a>
          .
        </div>
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
          with the key associated to your project. It can be obtained in the
          project settings under &quot;Project key&quot;.
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
          with the key associated to your project. It can be obtained in the
          project settings under &quot;Project key&quot;.
        </p>
        <h3>Development setup</h3>
        <p>
          When testing in a local development environment, for instance on
          localhost, use the <em>Development</em> project key. This is a private
          key that can be used from any host, bypassing domain whitelisting. For
          that reason, make sure to keep it private.
        </p>
        <h3>Production setup</h3>
        <p>
          When going live, the <em>Production</em> project key needs to be used.
          This is a public key that can safely be shared, and can only access
          the API from whitelisted domains. Whitelisting a domain is likewise
          done in the project settings.
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
              <th className="whitespace-nowrap text-left text-neutral-300">
                Prop
              </th>
              <th className="whitespace-nowrap text-left text-neutral-300">
                Default value
              </th>
              <th className="whitespace-nowrap text-left text-neutral-300">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-neutral-500">
                <code className="font-normal text-cyan-400">projectKey</code>
              </td>
              <td className="text-neutral-500"></td>
              <td className="text-neutral-500">
                Your project&apos;s public API key, found in the project
                settings.
              </td>
            </tr>
            <tr>
              <td className="text-neutral-500">
                <code className="font-normal text-cyan-400">model</code>
              </td>
              <td className="text-neutral-500">
                <code className="font-normal text-cyan-400">gpt-3.5-turbo</code>
              </td>
              <td className="text-neutral-500">
                The OpenAI completions model to use. Supported values:
                <div className="flex flex-row flex-wrap gap-1">
                  {SUPPORTED_MODELS.chat_completions.map((m) => {
                    return <C key={m} v={m} />;
                  })}
                  {SUPPORTED_MODELS.completions.map((m) => {
                    return <C key={m} v={m} />;
                  })}
                </div>
              </td>
            </tr>
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
              <td className="text-neutral-500">Ask me anything...</td>
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
          another way, you can make an POST request to the Markprompt API,
          passing in an authorization token that you can obtain in the{' '}
          <Link
            className="subtle-underline"
            href={`/${router.query?.team}/${router.query?.project}/settings`}
          >
            project settings
          </Link>
          .
        </p>
        <p>
          Please refer to the{' '}
          <a
            className="subtle-underline"
            target="_blank"
            rel="noreferrer"
            href="/docs#api"
          >
            in-depth API docs
          </a>{' '}
          for more details.
        </p>
      </div>
    </ProjectSettingsLayout>
  );
};

export default ComponentPage;
