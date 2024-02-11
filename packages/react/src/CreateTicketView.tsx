import type { FormEvent } from 'react';

import { ChevronLeftIcon } from './icons.js';

export interface CreateTicketViewProps {
  handleGoBack: () => void;
}

export function CreateTicketView(props: CreateTicketViewProps): JSX.Element {
  const { handleGoBack } = props;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('kek');
  };

  return (
    <>
      <div className="MarkpromptChatViewNavigation">
        <button className="MarkpromptGhostButton" onClick={handleGoBack}>
          <ChevronLeftIcon
            style={{ width: 16, height: 16 }}
            strokeWidth={2.5}
          />
        </button>
      </div>

      <div className="MarkpromptCreateTicketView">
        <h1>Create a case</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="bot@markprompt.com"
            />
          </div>
          <div>
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" placeholder={'Generating…'} />
          </div>
          <button type="submit">Submit case</button>
        </form>
      </div>
    </>
  );
}
