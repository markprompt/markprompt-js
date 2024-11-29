import type { MarkpromptOptions, View } from '../../types.js';
import { getDefaultView } from '../../utils.js';

export function getInitialView(options: MarkpromptOptions): View {
  if (options.defaultView) {
    return getDefaultView(options.defaultView, options);
  }

  if (options?.search?.enabled) {
    return 'search';
  }

  return 'chat';
}

export function getEnabledViews(options: MarkpromptOptions): View[] {
  const views: View[] = ['chat'];

  if (options?.search?.enabled) {
    views.push('search');
  }

  if (typeof options?.integrations?.createTicket === 'string') {
    views.push('ticket');
  }

  return views;
}
