import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { DbFile, Project } from '@/types/types';

export const getFileAtPath = async (
  supabase: SupabaseClient,
  projectId: Project['id'],
  path: string,
): Promise<DbFile['id'] | undefined> => {
  try {
    const { data } = await supabase
      .from('files')
      .select('id')
      .match({ project_id: projectId, path })
      .limit(1)
      .maybeSingle();
    return data?.id as DbFile['id'];
  } catch (error) {
    console.error('Error:', error);
  }
  return undefined;
};

export const createFile = async (
  supabase: SupabaseClient,
  projectId: Project['id'],
  path: string,
  meta: any,
): Promise<DbFile['id'] | undefined> => {
  let { error, data } = await supabase
    .from('files')
    .insert([{ project_id: projectId, path, meta }])
    .select('id')
    .limit(1)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data?.id as DbFile['id'];
};

export const getOpenAIKey = async (
  supabaseAdmin: SupabaseClient,
  projectId: Project['id'],
) => {
  const { data: openAIKeyData } = await supabaseAdmin
    .from('projects')
    .select('openai_key')
    .eq('id', projectId)
    .limit(1)
    .select()
    .maybeSingle();

  return openAIKeyData?.openai_key || undefined;
};
