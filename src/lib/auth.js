import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb'; // MongoDB connection
import { verifyPassword } from './password-utils'; // For password hashing (optional)

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        user: { label: 'Username', type: 'text', placeholder: 'Admin' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const db = client.db("usae-sport"); // Default database in MongoDB URI

          // Find user by username
          const user = await db.collection('User').findOne({ user: credentials.user });

          if (!user) {
            throw new Error('User not found');
          }

          // Verify password
          const isValid = await verifyPassword(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          // Return user object
          return {
            id: user._id.toString(),
            name: user.user,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
