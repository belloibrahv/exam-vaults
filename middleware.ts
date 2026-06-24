import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Redirect old learning paths to new dashboard learning paths
  if (pathname.startsWith('/learning')) {
    const newPath = pathname.replace('/learning', '/dashboard/learning');
    return NextResponse.redirect(new URL(newPath, req.url));
  }
  
  // Admin protection
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin?callbackUrl=' + encodeURIComponent(pathname), req.url));
    }
    
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  // Dashboard protection
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin?callbackUrl=' + encodeURIComponent(pathname), req.url));
    }
  }

  // Exam protection
  if (pathname.startsWith('/exam')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin?callbackUrl=' + encodeURIComponent(pathname), req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/exam/:path*',
    '/learning/:path*',
  ],
};
