import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitLabProvider from 'next-auth/providers/gitlab';

import { UserSession } from '@/common/types';
import { serverConfig } from '@/config/server';
import { createInnoUserIfNotExist } from '@/utils/requests/innoUsers/requests';

const loadProviders = () => {
  // Only checking if one of the required variables is set, the ENV validation does the rest.
  const providers = [];
  if (serverConfig.NEXTAUTH_AZURE_CLIENT_ID)
    providers.push(
      AzureADProvider({
        clientId: serverConfig.NEXTAUTH_AZURE_CLIENT_ID,
        clientSecret: serverConfig.NEXTAUTH_AZURE_CLIENT_SECRET as string,
        tenantId: serverConfig.NEXTAUTH_AZURE_TENANT_ID,
      }),
    );

  if (serverConfig.NEXTAUTH_GITLAB_ID) {
    providers.push(
      GitLabProvider({
        clientId: serverConfig.NEXTAUTH_GITLAB_ID as string,
        clientSecret: serverConfig.NEXTAUTH_GITLAB_SECRET as string,
        accessTokenUrl: serverConfig.NEXTAUTH_GITLAB_URL + '/oauth/token',
        authorization: { url: serverConfig.NEXTAUTH_GITLAB_URL + '/oauth/authorize?response_type=code' },
        userinfo: serverConfig.NEXTAUTH_GITLAB_URL + '/api/v4/user',
        token: {
          url: serverConfig.NEXTAUTH_GITLAB_URL + '/oauth/token',
        },
      }),
    );
  }
  if (serverConfig.NEXTAUTH_CREDENTIALS_USERNAME) {
    providers.push(
      CredentialsProvider({
        name: 'Testbenutzer',
        async authorize(credentials) {
          const username = serverConfig.NEXTAUTH_CREDENTIALS_USERNAME;
          const password = serverConfig.NEXTAUTH_CREDENTIALS_PASSWORD;
          if (!credentials || credentials.username !== username || credentials.password !== password) return null;
          return {
            id: '1',
            name: 'Testbenutzer',
            username: credentials.username,
            email: `${credentials.username}@tester.com`,
          };
        },
        credentials: {
          username: { label: 'username', type: 'text' },
          password: { label: 'password', type: 'password' },
        },
      }),
    );
  }
  return providers;
};

export const options: NextAuthOptions = {
  providers: loadProviders(),
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
