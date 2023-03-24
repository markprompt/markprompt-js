import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';

type Data = {
  status?: string;
  error?: string;
};

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

  const { data, error } = await supabase
    .from('teams')
    .select('stripe_customer_id')
    .eq('id', req.body.teamId)
    .maybeSingle();

  if (error || !data?.stripe_customer_id) {
    return res.status(400).json({ error: 'Customer not found.' });
  }

  const subscription = await stripe.subscriptions.list({
    customer: data.stripe_customer_id,
    limit: 1,
  });

  const subscriptionId = subscription.data[0].id;
  if (!subscriptionId) {
    return res.status(400).json({ error: 'No subscription found.' });
  }

  const deleted = await stripe.subscriptions.del(subscriptionId);

  if (deleted?.id) {
    // We can safely assume the subscription was cancelled, no
    // need to wait for the webhook to trigger.
    await supabase
      .from('teams')
      .update({
        stripe_customer_id: null,
        stripe_price_id: null,
        billing_cycle_start: null,
      })
      .eq('stripe_customer_id', data.stripe_customer_id);

    return res.status(200).end();
  }

  return res.status(400).json({ error: 'Unable to cancel subscription.' });
}
