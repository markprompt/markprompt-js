import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import JSZip from 'jszip';
import type { NextApiRequest, NextApiResponse } from 'next';

import { compress, shouldIncludeFileWithPath } from '@/lib/utils';
import { Database } from '@/types/supabase';
import { PathContentData } from '@/types/types';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | Buffer;

const allowedMethods = ['POST'];

const PAYLOAD_MAX_SIZE_BYTES = 4_000_000;

const extractFromZip = async (
  zipFiles: typeof JSZip.files,
  offset = 0,
  includeGlobs: string[],
  excludeGlobs: string[],
): Promise<PathContentData[]> => {
  const mdFileData: PathContentData[] = [];

  // Remove all non-md files here, we don't want to carry an
  // entire repo over the wire. We sort the keys, as I am not
  // sure that two subsequent calls to download a zip archive
  // from GitHub always produces that same file structure.
  const relativePaths = Object.keys(zipFiles)
    .sort()
    .filter((p) => {
      // Ignore files with unsupported extensions and files in dot
      // folders, like .github.
      return shouldIncludeFileWithPath(p, includeGlobs, excludeGlobs);
    });

  for (let i = offset; i < relativePaths.length; i++) {
    const relativePath = relativePaths[i];

    // In a GitHub archive, the file tree is contained in a top-level
    // parent folder named `<repo>-<branch>`. We don't want to have
    // references to this folder in the exposed file tree.
    let path = relativePath.split('/').slice(1).join('/');
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    const content = await zipFiles[relativePath].async('text');
    mdFileData.push({ path, content });
  }

  return mdFileData;
};

const getCompressedPayloadUntilLimit = (files: PathContentData[]) => {
  const filesToSend: PathContentData[] = [];
  for (const file of files) {
    filesToSend.push(file);
    const compressed = Buffer.from(
      compress(JSON.stringify({ files: filesToSend, capped: true })),
    );
    if (compressed.length >= PAYLOAD_MAX_SIZE_BYTES) {
      // We've gone above the limit
      filesToSend.pop();
      return Buffer.from(
        compress(JSON.stringify({ files: filesToSend, capped: true })),
      );
    }
  }
  return Buffer.from(compress(JSON.stringify({ files: filesToSend })));
};

const fetchRepo = async (owner: string, repo: string, branch: string) => {
  return fetch(
    `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`,
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (!req.method || !allowedMethods.includes(req.method)) {
    res.setHeader('Allow', allowedMethods);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const supabase = createServerSupabaseClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Fetch main branch
  let githubRes = await fetchRepo(req.body.owner, req.body.repo, 'main');

  if (githubRes.status !== 200) {
    // If main branch doesn't exist, fallback to master
    githubRes = await fetchRepo(req.body.owner, req.body.repo, 'master');
  }

  if (githubRes.status !== 200) {
    return res.status(404).json({
      error:
        'Failed to download repository. Make sure the main or master branch is accessible.',
    });
  }

  const ab = await githubRes.arrayBuffer();
  const jsZip = new JSZip();
  const zip = await jsZip.loadAsync(ab);

  // First, we load all the files, taking into account the start
  // offset if provided.
  const files = await extractFromZip(
    zip.files,
    req.body.offset ?? 0,
    req.body.includeGlobs,
    req.body.excludeGlobs,
  );

  // Then, we compute the compressed size. It needs to be < 4MB to
  // meet the Vercel limits:
  // https://vercel.com/docs/concepts/limits/overview.
  // If we're below the limit, which we will be most of the time,
  // we send it as is.
  let compressed = Buffer.from(compress(JSON.stringify({ files })));

  if (compressed.length < PAYLOAD_MAX_SIZE_BYTES) {
    return res.status(200).send(compressed);
  }

  // If not, build up the payload one page at a time until we hit the
  // upper bound.
  compressed = getCompressedPayloadUntilLimit(files);

  return res.status(200).send(compressed);
}
