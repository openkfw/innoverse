import withAuth from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) =>
      req.nextUrl.pathname === '/gitlab' ||
      req.nextUrl.pathname === '/api/health' ||
      req.nextUrl.pathname === '/api/hooks/push' ||
      req.nextUrl.pathname === '/api/hooks/weekly-email' ||
      req.nextUrl.pathname === '/api/notification/email-preferences' ||
      req.nextUrl.pathname === '/api/liveness' ||
      req.nextUrl.pathname === '/api/readiness' ||
      req.nextUrl.pathname === '/manifest.json' ||
      req.nextUrl.pathname.startsWith('/fonts') ||
      !!token,
  },
  pages: {
    signIn: '/auth/signin',
  },
});
