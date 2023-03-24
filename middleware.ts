import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import CompletionsMiddleware from './lib/middleware/completions';
import AppMiddleware from './lib/middleware/app';
import { getHost } from './lib/utils';
import TrainMiddleware from './lib/middleware/train';

export const config = {
  matcher: [
    '/((?!_next/|_proxy/|_auth/|_root/|_static|static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const hostname = req.headers.get('host');

  if (hostname === getHost()) {
    return AppMiddleware(req);
  }

  if (hostname === 'api.markprompt.com' || hostname === 'api.localhost:3000') {
    const path = req.nextUrl.pathname;

    if (path?.startsWith('/completions')) {
      return CompletionsMiddleware(req);
    } else if (path?.startsWith('/train')) {
      return TrainMiddleware(req);
    }
  }

  return NextResponse.next();
}
