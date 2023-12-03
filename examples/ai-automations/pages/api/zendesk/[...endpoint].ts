// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

// see https://docs.smooch.io/rest/ for API docs
const base = `https://api.smooch.io/v2/apps/${process.env.ZENDESK_APP_ID}`;

async function zendesk(endpoint: string, init?: RequestInit) {
  const res = await fetch(`${base}/${endpoint}`, {
    headers: {
      Accepts: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(
        `${process.env.ZENDESK_KEY_ID}:${process.env.ZENDESK_SECRET_KEY}`,
      )}`,
    },
    ...init,
  });

  const j = await res.json();
  console.log('In here', JSON.stringify(j, null, 2));
  return j;

  // return res.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const endpoint = req.query.endpoint as string[];

  const zendeskResponse = await zendesk(endpoint.join('/'), {
    method: req.method,
    ...(req.body ? { body: req.body } : {}),
  });

  console.log('zendeskResponse', JSON.stringify(zendeskResponse, null, 2));

  if (zendeskResponse.errors) {
    return res.status(400).json(zendeskResponse);
  }

  return res.status(200).json(zendeskResponse);
}
