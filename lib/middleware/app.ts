import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

const UNAUTHED_PATHS = [
  '/',
  '/login',
  '/signup',
  '/legal/terms',
  '/legal/privacy',
  '/api/subscriptions/webhook',
];

export default async function AppMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user && !UNAUTHED_PATHS.includes(path)) {
    return NextResponse.redirect(new URL('/login', req.url));
  } else if (session?.user && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.rewrite(new URL(path, req.url));
}
