import withAuth from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) =>
      req.nextUrl.pathname === '/api/readiness' ||
      !!token,
  },
  pages: {
    signIn: '/auth/signin',
  },
});
