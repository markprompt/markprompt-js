import { ProjectSettingsLayout } from '@/components/layouts/ProjectSettingsLayout';
import { Playground } from '@/components/files/Playground';
import * as Select from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import { FC, forwardRef, ReactNode } from 'react';
import cn from 'classnames';
import { useLocalStorage } from '@/lib/hooks/utils/use-localstorage';
import { OpenAIModelId, SUPPORTED_MODELS } from '@/types/types';
import useProject from '@/lib/hooks/use-project';

type SelectItemProps = {
  className?: string;
  children?: ReactNode;
} & any;

const SelectItem: FC<SelectItemProps> = forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={cn(
          'relative flex cursor-pointer select-none items-center py-1 pl-8 pr-4 text-xs text-neutral-500 outline-none transition hover:bg-neutral-900',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-2 flex h-4 w-4 items-center justify-center text-neutral-100">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

SelectItem.displayName = 'SelectItem';

const PlaygroundPage = () => {
  const { project } = useProject();
  const [model, setModel] = useLocalStorage<OpenAIModelId>(
    'playground-model',
    'gpt-4',
  );

  return (
    <ProjectSettingsLayout title="Playground" noHeading>
      <div className="panel-glow-color relative mx-auto h-[calc(100vh-240px)] max-w-screen-md rounded-lg border border-neutral-900 bg-neutral-1000 px-8 py-6">
        {project && (
          <Playground projectKey={project.private_dev_api_key} model={model} />
        )}
        <div className="absolute bottom-4 right-4 z-20 flex flex-row items-center gap-1 text-xs text-neutral-500">
          Model:
          <Select.Root onValueChange={setModel} value={model}>
            <Select.Trigger
              className="flex flex-row items-center justify-center gap-1 rounded py-1 pl-2 pr-1 text-xs text-neutral-500 outline-none hover:bg-neutral-900"
              aria-label="Model"
            >
              <Select.Value placeholder={model} />
              <Select.Icon className="text-neutral-500">
                <ChevronDownIcon className="h-3 w-3" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-30 overflow-hidden rounded-md border border-neutral-900 bg-neutral-1000 pb-4 shadow-2xl">
                <Select.ScrollUpButton className="flex h-4 w-4 items-center justify-center text-fuchsia-500">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport>
                  <Select.Group>
                    <Select.Label className="pl-8 pr-4 pb-1 pt-6 text-[11px] uppercase text-neutral-600">
                      Chat
                    </Select.Label>
                    {SUPPORTED_MODELS.chat_completions.map((m) => {
                      return (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      );
                    })}
                  </Select.Group>

                  <Select.Group>
                    <Select.Label className="pl-8 pr-4 pb-1 pt-6 text-[11px] uppercase text-neutral-600">
                      Completions
                    </Select.Label>
                    {SUPPORTED_MODELS.completions.map((m) => {
                      return (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      );
                    })}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex h-4 w-full cursor-pointer items-center justify-center text-neutral-500">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
    </ProjectSettingsLayout>
  );
};

export default PlaygroundPage;
