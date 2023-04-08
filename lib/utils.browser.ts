// Browser-dependent utilities. Cannot run on edge runtimes.
import {
  DEFAULT_MARKPROMPT_CONFIG,
  MarkpromptConfigType,
  parse,
} from './schema';
import { Json } from '@/types/supabase';

export const getMarkpromptConfigOrDefault = (
  markpromptConfig: Json | undefined,
): MarkpromptConfigType => {
  return (markpromptConfig ||
    parse(DEFAULT_MARKPROMPT_CONFIG)) as MarkpromptConfigType;
};
