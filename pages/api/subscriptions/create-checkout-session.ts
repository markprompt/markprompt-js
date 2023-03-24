import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { stripe } from '@/lib/stripe/server';
import { getOrigin } from '@/lib/utils';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | { sessionId: string };

const allowedMethods = ['POST'];

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
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const redirect = `${getOrigin()}/${req.body.redirect}`;

  const stripeSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    success_url: redirect,
    cancel_url: redirect,
    line_items: [{ price: req.body.priceId, quantity: 1 }],
    mode: 'subscription',
    client_reference_id: req.body.teamId,
    metadata: { appId: process.env.NEXT_PUBLIC_STRIPE_APP_ID || '' },
  });

  return res.status(200).json({ sessionId: stripeSession.id });
}
