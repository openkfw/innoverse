import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GitLabProvider from 'next-auth/providers/gitlab';

import { UserSession } from '@/common/types';
import { createInnoUserIfNotExist } from '@/utils/requests';

export const options: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.NEXTAUTH_AZURE_CLIENT_ID as string,
      clientSecret: process.env.NEXTAUTH_AZURE_CLIENT_SECRET as string,
      tenantId: process.env.NEXTAUTH_AZURE_TENANT_ID,
    }),
    GitLabProvider({
      clientId: process.env.NEXTAUTH_GITLAB_ID as string,
      clientSecret: process.env.NEXTAUTH_GITLAB_SECRET as string,
      accessTokenUrl: process.env.NEXTAUTH_GITLAB_URL + '/oauth/token',
      authorization: { url: process.env.NEXTAUTH_GITLAB_URL + '/oauth/authorize?response_type=code' },
      userinfo: process.env.NEXTAUTH_GITLAB_URL + '/api/v4/user',
      token: {
        url: process.env.NEXTAUTH_GITLAB_URL + '/oauth/token',
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({}) {
      return true;
    },
    async jwt({ token, account }) {
      if (account && token.name && token.email) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        const user: UserSession = {
          name: token.name,
          email: token.email,
          providerId: token.sub as string,
          provider: token.provider as string,
        };
        await createInnoUserIfNotExist(user, token.picture);
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          image: session.user.image,
          id: token.sub,
          providerId: token.sub as string,
          provider: token.provider as string,
        },
        provider: token.provider,
      };
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  jwt: {
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
