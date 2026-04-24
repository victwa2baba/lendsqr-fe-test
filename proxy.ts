import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // You can modify this middleware as per your project's requirements.
  if (!token) return NextResponse.redirect(new URL('/login', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Can be modified for different routes to be targeted
};
