import withAuth from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) =>
      req.nextUrl.pathname === '/gitlab' ||
      req.nextUrl.pathname === '/api/readiness' ||
      req.nextUrl.pathname === '/api/hooks/push' ||
      req.nextUrl.pathname === '/api/notification/update-subscription' ||
      req.nextUrl.pathname === '/manifest.json' ||
      req.nextUrl.pathname.startsWith('/fonts') ||
      !!token,
  },
  pages: {
    signIn: '/auth/signin',
  },
});
