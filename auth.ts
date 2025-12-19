import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/validations';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'user' | 'admin';
    } & DefaultSession['user'];
  }

  interface User {
    role: 'user' | 'admin';
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const validated = loginSchema.parse(credentials);
          const supabase = await connectDB();

          const { data: user, error } = await supabase
            .from('users')
            .select('id, email, name, password, role, image')
            .eq('email', validated.email.toLowerCase())
            .single();

          if (error || !user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(
            validated.password,
            user.password
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'user' | 'admin';
      }
      return session;
    },
  },
});
