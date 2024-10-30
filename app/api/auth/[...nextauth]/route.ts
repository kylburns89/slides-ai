import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface ExtendedToken extends JWT {
  accessToken?: string;
}

interface ExtendedSession extends Session {
  user: {
    accessToken?: string;
    email?: string;
    image?: string;
    name?: string;
  };
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive.file email profile",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }): Promise<ExtendedToken> {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      // @ts-expect-error Token contains additional properties that aren't typed
      session.user.accessToken = token.accessToken;
      return session as ExtendedSession;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
