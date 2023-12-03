import { CATEGORIES } from '@/lib/constants';

import { Button } from './Button';
import { Dropdown } from './Dropdown';

export const TicketForm = ({
  problemArea,
  subject,
  description,
}: {
  problemArea: string;
  subject: string;
  description: string;
}) => {
  return (
    <div className="prose max-w-full grid grid-cols-2 gap-x-8 gap-y-2">
      <div className="col-span-2">
        <h4>Which account is affected?</h4>
      </div>
      <div className="col-span-2">
        <Dropdown
          className="w-full"
          selected={0}
          options={['michael@markprompt.com', 'michael@motif.land']}
        />
      </div>
      <div className="col-span-2">
        <h4>What product are you having problems with?</h4>
      </div>
      <div className="col-span-2">
        <div className="text-xs mb-1">Product</div>
        <Dropdown
          className="w-full"
          selected={0}
          options={['Platform', 'Mobile App']}
        />
      </div>
      <div className="col-span-2">
        <h4>What area are you having problems with?</h4>
      </div>
      <div>
        <div className="text-xs mb-1">Problem area</div>
        <Dropdown
          className="w-full"
          selected={problemArea ? CATEGORIES.indexOf(problemArea) : 0}
          options={CATEGORIES}
        />
      </div>
      <div>
        <div className="text-xs mb-1">Security level</div>
        <Dropdown className="w-full" selected={0} options={['Severity 1']} />
      </div>
      <div className="col-span-2">
        <h4>Which project is affected?</h4>
      </div>
      <div className="col-span-2">
        <div className="text-xs mb-1">Subject</div>
        <input
          value={subject}
          id="description"
          className="py-1.5 px-2 w-full appearance-none rounded-md border bg-white text-neutral-900 transition duration-200 placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:text-neutral-500 border-neutral-200 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 text-sm"
        />
      </div>
      <div className="col-span-2">
        <div className="text-xs mb-1">Description</div>
        <textarea
          value={description || ''}
          id="description"
          className="py-1.5 px-2 w-full h-[360px] appearance-none rounded-md border bg-white text-neutral-900 transition duration-200 placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:text-neutral-500 border-neutral-200 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10 text-sm"
        />
      </div>
      <div className="col-span-2">
        <Button variant="cta" className="place-self-end">
          Create case
        </Button>
      </div>
    </div>
  );
};
