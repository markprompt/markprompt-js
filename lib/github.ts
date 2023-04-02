import { Octokit } from 'octokit';
import { isPresent } from 'ts-is-present';
import { FileData, PathContentData } from '@/types/types';
import {
  decompress,
  getNameFromPath,
  shouldIncludeFileWithPath,
} from './utils';

const JSZip = require('jszip');

const octokit = new Octokit();

const parseGitHubURL = (url: string) => {
  const match = url.match(
    /^https:\/\/github.com\/([a-zA-Z0-9\-_\.]+)\/([a-zA-Z0-9\-_\.]+)/,
  );
  if (match && match.length > 2) {
    return { owner: match[1], repo: match[2] };
  }
  return undefined;
};

export const isGitHubRepoAccessible = async (url: string) => {
  const info = parseGitHubURL(url);
  if (!info?.owner && !info?.repo) {
    return false;
  }
  try {
    const res = await octokit.request(`GET /repos/${info.owner}/${info.repo}`);
    if (res.status === 200) {
      return true;
    }
  } catch (e) {
    //
  }
  return false;
};

const getRepo = async (owner: string, repo: string) => {
  const res = await octokit.request('GET /repos/{owner}/{repo}', {
    owner,
    repo,
  });
  return res.data;
};

const getDefaultBranch = async (owner: string, repo: string) => {
  const _repo = await getRepo(owner, repo);

  const branchRes = await octokit.request(
    `GET /repos/{owner}/{repo}/branches/{branch}`,
    { owner, repo, branch: _repo.default_branch },
  );

  return branchRes.data;
};

const getTree = async (owner: string, repo: string) => {
  const defaultBranch = await getDefaultBranch(owner, repo);

  const tree = await octokit.request(
    'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
    {
      owner,
      repo,
      tree_sha: defaultBranch.commit.sha,
      recursive: '1',
    },
  );

  return tree.data.tree;
};

export const getOwnerRepoString = (url: string) => {
  const info = parseGitHubURL(url);
  if (!info?.owner && !info?.repo) {
    return undefined;
  }
  return `${info.owner}/${info.repo}`;
};

export const getRepositoryMDFilesInfo = async (
  url: string,
): Promise<{ name: string; path: string; url: string; sha: string }[]> => {
  const info = parseGitHubURL(url);
  if (!info?.owner && !info?.repo) {
    return [];
  }

  const tree = await getTree(info.owner, info.repo);

  const mdFileUrls = tree
    .map((f) => {
      if (f.url && f.path && shouldIncludeFileWithPath(f.path)) {
        let path = f.path;
        if (!path.startsWith('/')) {
          path = '/' + path;
        }
        return {
          name: getNameFromPath(f.path),
          path,
          url: f.url,
          sha: f.sha || '',
        };
      }
      return undefined;
    })
    .filter(isPresent);
  return mdFileUrls;
};

const paginatedFetchRepo = async (
  owner: string,
  repo: string,
  offset: number = 0,
): Promise<{ files: PathContentData[]; capped?: boolean }> => {
  const res = await fetch('/api/github/fetch', {
    method: 'POST',
    body: JSON.stringify({ owner, repo, offset }),
    headers: { 'Content-Type': 'application/json' },
  });
  const ab = await res.arrayBuffer();
  return JSON.parse(decompress(Buffer.from(ab)));
};

export const getGitHubMDFiles = async (url: string): Promise<FileData[]> => {
  const info = parseGitHubURL(url);
  if (!info?.owner && !info?.repo) {
    return [];
  }

  let data = await paginatedFetchRepo(info.owner, info.repo);
  let allFilesData = data.files;
  while (data.capped) {
    data = await paginatedFetchRepo(info.owner, info.repo, allFilesData.length);
    allFilesData = [...allFilesData, ...data.files];
  }

  return allFilesData.map((fileData) => {
    return {
      ...fileData,
      name: getNameFromPath(fileData.path),
    };
  });
};
