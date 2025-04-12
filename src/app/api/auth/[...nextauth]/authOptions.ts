import { loginUser } from '@/lib/authService';
import { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export interface UserResponse {
  name: string;
  isAdmin: boolean;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const user = await loginUser(credentials.email, credentials.password);
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/api/auth/login',
    newUser: '/api/auth/signup',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = token as unknown as UserResponse;
      session.token = token.token as unknown as string;
      return session;
    },
  },
};
