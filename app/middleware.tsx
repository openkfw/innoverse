import withAuth from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) =>
      req.nextUrl.pathname === '/api/hooks/push' ||
      req.nextUrl.pathname === '/api/notification/update-subscription' ||
      !!token,
  },
  pages: {
    signIn: '/auth/signin',
  },
});
