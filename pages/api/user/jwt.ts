import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type Data = { error?: string } | { customerJwt: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const supabase = createServerSupabaseClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const customerJwt = jwt.sign(
    {
      fullName: session.user.user_metadata.full_name,
      shortName: session.user.user_metadata.name,
      email: {
        email: session.user.email,
        isVerified: false,
      },
      externalId: session.user.email,
    },
    process.env.PLAIN_SECRET_KEY!,
    {
      algorithm: 'RS256',
      expiresIn: '1h',
    },
  );

  return res.status(200).json({ customerJwt });
}
