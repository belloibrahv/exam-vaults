export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/exam/:path*', '/admin/:path*', '/learning/:path*'],
};
