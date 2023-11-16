import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GitLabProvider from 'next-auth/providers/gitlab';

const PROVIDERS = {
  GITLAB: 'gitlab',
  AZURE_AD: 'azure-ad',
};

const options: NextAuthOptions = {
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
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      const gitlabId = token.provider == PROVIDERS.GITLAB ? token.sub : null;
      const azureId = token.provider == PROVIDERS.AZURE_AD ? token.sub : null;
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          provider: token.provider,
          gitlabId,
          azureId,
        },
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
