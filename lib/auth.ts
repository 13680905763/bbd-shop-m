// lib/auth.ts
// import https from "https";

// import { HttpsProxyAgent } from "https-proxy-agent";
// https.globalAgent = new HttpsProxyAgent("http://127.0.0.1:7890");
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// import GitHubProvider from "next-auth/providers/github";
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile", // ✅ 一定要加 openid
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  // providers: [
  //   GitHubProvider({
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //   }),
  // ],

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  callbacks: {
    async jwt({ token, account }) {
      // 登录时，把access_token存在token里
      if (account) {
        console.log("jwt callback:", { token, account });

        token.accessToken = account.access_token;
        token.id_token = account.id_token;
      }

      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;

      return session;
    },
  },
};
