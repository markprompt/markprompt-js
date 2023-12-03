/* eslint-disable @next/next/no-img-element */
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp, ChevronsDown } from 'lucide-react';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { processCorporatePlanActivation } from '@/lib/functions/corporate';
import { processClassCreditInquiry } from '@/lib/functions/credits';
import { processReferralVerification } from '@/lib/functions/referral';
import { processRefund } from '@/lib/functions/refund';
import { Markprompt } from '@/lib/react';
import { timeout } from '@/lib/utils';
import { companyData } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

const SelectItem = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ children, className, ...props }: any, forwardedRef) => {
    return (
      <Select.Item
        className={`text-sm flex flex-row gap-2 items-center pl-8 pr-2 py-2 outline-none hover:bg-neutral-100 cursor-pointer ${className}`}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-2 w-8 items-center justify-center">
          <Check className="w-4 h-4 text-blue-500" />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

SelectItem.displayName = 'SelectItem';

export const Field = ({
  label,
  value: _value,
  onChange,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
}) => {
  const [value, setValue] = useState(_value);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-neutral-500">{label}</p>
      <input
        type="text"
        className="base-button p-2 border border-neutral-200 rounded"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
      />
    </div>
  );
};

export type UserInfo = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  accountType: string;
  avatarUrl: string;
};

export type Data = {
  user: UserInfo;
};

const defaultData: Data = {
  user: {
    id: 'alexakendricks',
    firstName: 'Alexa',
    lastName: 'Kendricks',
    username: 'alexakendricks',
    email: 'alexa.kendricks@acme.com',
    accountType: 'Accelerate',
    avatarUrl: '/avatar.png',
  },
};

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<Data | undefined>();
  const [isSaving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const demoDataString = localStorage.getItem('markprompt-demo-data');
      if (demoDataString) {
        const demoData = JSON.parse(demoDataString);
        setData(demoData);
      } else {
        setData(defaultData);
        // First time, store locally to make available globally, e.g. in the
        // Zendesk hooks.
        localStorage.setItem(
          'markprompt-demo-data',
          JSON.stringify(defaultData),
        );
      }
    } catch {
      // Do nothing
    }
  }, []);

  const saveData = useCallback(async () => {
    if (!data) {
      return;
    }
    setSaving(true);
    localStorage.setItem('markprompt-demo-data', JSON.stringify(data));
    await timeout(500);
    setSaving(false);
    toast.success('Settings have been saved');
  }, [data]);

  const clearData = useCallback(() => {
    localStorage.removeItem('markprompt');
    localStorage.removeItem('markprompt-zendesk-store');
    localStorage.removeItem('markprompt-demo-data');
    setData(defaultData);
    router.reload();
  }, [router]);

  if (!data) {
    return <></>;
  }

  return (
    <main
      className={`relative flex min-h-screen flex-col items-center justify-between ${inter.className}`}
    >
      <Head>
        <title>{`${companyData.name} | Settings`}</title>
        <meta charSet="utf-8" />
      </Head>

      <Markprompt
        projectKey={process.env.NEXT_PUBLIC_PROJECT_KEY!}
        chat={{
          enabled: true,
          model: 'gpt-4-1106-preview',
          apiUrl: `https://api.markprompt.dev/v1/chat`,
          systemPrompt: `You are a company representative from ${companyData.name} who loves to help people. Here is some important information about the user your are speaking with:
- First name: "${data.user.firstName}"
- Last name: "${data.user.lastName}"
- Email: "${data.user.email}"
- Username: "${data.user.username}"
- Account type: "${data.user.accountType}"
It is important to use this information when needed.

Some other important rules to strictly follow:
- Never make up a fake email address.

Only use functions and function parameters you have been provided with.`,
          functions: [
            {
              actual: processRefund(data.user || defaultData.user),
              name: 'processRefund',
              description:
                'Cancel auto-renewal and process a refund for a customer',
              confirmationMessage: () => (
                <>
                  Please confirm that you want to cancel auto-renewal and
                  proceed with a refund.
                </>
              ),
              parameters: {
                type: 'object',
                properties: {
                  userId: {
                    type: 'string',
                    description: 'The username or email address of the user',
                  },
                  billingCycleEnd: {
                    type: 'string',
                    description: 'The date the billing cycle ends',
                  },
                },
                required: ['userId', 'billingCycleEnd'],
              },
            },
            {
              actual: processReferralVerification,
              name: 'processReferralVerification',
              description:
                'Verify if a referral was successful and the user is eligible for a reward',
              confirmationMessage: (args) => (
                <>
                  Just to make sure I got this right. You want to claim credits
                  for the referral of{' '}
                  <strong>{(args?.friendEmail as string) || ''}</strong>, is
                  that correct?
                </>
              ),
              parameters: {
                type: 'object',
                properties: {
                  userEmail: {
                    type: 'string',
                    description: 'The username or email address of the user',
                  },
                  friendEmail: {
                    type: 'string',
                    description: 'The email of the referred friend',
                  },
                },
                required: ['friendEmail', 'userId', 'referralCode'],
              },
            },
            {
              actual: processCorporatePlanActivation,
              name: 'processCorporatePlanActivation',
              description: `Activate a user account and assign a ${companyData.name} corporate plan to the account.`,
              confirmationMessage: (args) => (
                <>
                  Do you want to activate your user account and assign a{' '}
                  <strong>{(args?.corporateName as string) || ''}</strong>{' '}
                  corporate plan to the account?
                </>
              ),
              parameters: {
                type: 'object',
                properties: {
                  userId: {
                    type: 'string',
                    description: 'The username or email address of the user',
                  },
                  corporateName: {
                    type: 'string',
                    description: 'The corporate name to which the plan belongs',
                  },
                },
                required: ['userId', 'corporateName'],
              },
            },
            {
              actual: processClassCreditInquiry,
              name: 'processClassCreditInquiry',
              description: 'Retrieve the number of credits a class costs',
              autoConfirm: true,
              // confirmationMessage: (args) => <>Please confirm we got this right. You are looking for the number of credits for the class <strong>{args?.classId as string || ''}</strong>, is that correct?</>,
              parameters: {
                type: 'object',
                properties: {
                  className: {
                    type: 'string',
                    description: 'The name of the class',
                  },
                },
                required: ['userId', 'classId'],
              },
            },
          ],
        }}
        references={{ display: 'end' }}
        showBranding={false}
      />

      <div className="px-4 py-4 w-full shadow-lg bg-white flex flex-row gap-4 items-center flex-none z-10">
        <div className="flex-grow">
          <img
            src={`/logos/${companyData.id}/logo.svg`}
            alt="Company Logo"
            className="dark:invert"
            width={120}
            height={32}
          />
        </div>
        <div>
          <div
            className="rounded-full overflow-hidden"
            onClick={() => {
              clearData();
            }}
          >
            <Image
              src="/avatar.png"
              alt="Alexa Kendricks"
              width={32}
              height={32}
              priority
            />
          </div>
        </div>
        <ChevronDown className="text-black w-5 h-5 flex-none" />
      </div>
      <div className="grid grid-cols-3 flex-grow w-full pr-48">
        <div className="h-full bg-neutral-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div />
            <div className="pt-16 flex flex-col gap-6 text-[13px] font-medium">
              <Image
                className="rounded-full overflow-hidden border mb-8"
                src="/avatar.png"
                alt="Alexa Doe"
                width={100}
                height={100}
                priority
              />

              <p>Account</p>
              <p className="text-blue-500">Personal Information</p>
              <p>Contact</p>
              <p>Billing</p>
              <p>Recent charges</p>
            </div>
          </div>
        </div>
        <div className="col-span-2 pl-8 pt-20 pb-8">
          <h2 className="text-3xl font-semibold">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4 mt-8 text-sm">
            <Field
              label="First name"
              value={data.user.firstName}
              onChange={(value) => {
                setData({ ...data, user: { ...data.user, firstName: value } });
              }}
            />
            <Field
              label="Last name"
              value={data.user.lastName}
              onChange={(value) => {
                setData({ ...data, user: { ...data.user, lastName: value } });
              }}
            />
            <Field
              label="Primary email"
              value={data.user.email}
              onChange={(value) => {
                setData({ ...data, user: { ...data.user, email: value } });
              }}
            />
            <Field label="Secondary email" value="" />
            <Field
              label="Username"
              value={data.user.username}
              onChange={(value) => {
                setData({ ...data, user: { ...data.user, username: value } });
              }}
            />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-neutral-500 text-sm">Account type</p>
            <div className="text-black font-medium">
              <Select.Root
                defaultValue={data.user.accountType}
                onValueChange={(value) => {
                  setData({
                    ...data,
                    user: { ...data.user, accountType: value },
                  });
                }}
              >
                <Select.Trigger
                  className="base-button flex flex-row gap-2 items-center rounded-md bg-neutral-100 hover:bg-neutral-200 px-3 py-2 border border-neutral-200 hover:border-neutral-300 text-sm"
                  aria-label="Account type"
                >
                  <Select.Value placeholder="Select account type…" />
                  <Select.Icon>
                    <ChevronDown className="w-4 h-4 text-neutral-800" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="SelectContent">
                    <Select.ScrollUpButton className="SelectScrollButton">
                      <ChevronUp />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="text-sm">
                      <Select.Group>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Starter">Starter</SelectItem>
                        <SelectItem value="Accelerate">Accelerate</SelectItem>
                        <SelectItem value="Ultimate">Ultimate</SelectItem>
                        <SelectItem value="Ultimate Plus">
                          Ultimate Plus
                        </SelectItem>
                      </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton className="SelectScrollButton">
                      <ChevronsDown />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
          <div className="w-full h-px bg-neutral-200 col-span-2 mt-8" />
          <div className="flex items-start mt-8">
            <Button
              className="relative px-4 py-3 rounded-md bg-blue-500 text-sm font-medium text-white text-center base-button"
              onClick={saveData}
              loading={isSaving}
              noStyle
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
