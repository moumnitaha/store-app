import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import NextAuth from "next-auth";
import NextAuthOptions from "next-auth";
import { JWT } from "next-auth/jwt";

const getUserByEmail = async (email: string) => {
  const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
};

type credentials = {
  email: string;
  password: string;
};

type User = {
  id: number;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export const OPTIONS: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: credentials) {
        if (credentials === null) return null;
        try {
          const user = await getUserByEmail(credentials?.email);
          console.log("User => : ", user);
          if (user) {
            const isMatch = user?.password === credentials.password;
            if (isMatch) {
              return user;
            } else {
              throw new Error("Email or Password is not correct");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (error: Error | any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.first_name + " " + user.last_name;
        token.image = user.avatar;
      }
      return token;
    },
    async session(session, token) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.SECRET,
  debug: true,
};

const handler = NextAuth(OPTIONS);

console.log("Handler: ", handler);

export { handler as GET, handler as POST, handler as auth };
