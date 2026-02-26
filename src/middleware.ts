import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken, verifyToken } from '@/lib/auth';

const protectedPaths = ['/api/auth/me'];
const protectedWritePrefix = '/api/items';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isWriteToItems = pathname.startsWith(protectedWritePrefix) && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);

  if (!isProtectedPath && !isWriteToItems) {
    return NextResponse.next();
  }

  const token = getBearerToken(req.headers.get('authorization'));
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.sub);
    response.headers.set('x-user-role', payload.role);
    return response;
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*']
};
