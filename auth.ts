import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import jwt from "jsonwebtoken";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      checks: ["state"],
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        // Generate the Bearer token for the app's internal APIs
        token.accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // @ts-ignore - custom property
        session.user.token = token.accessToken as string;

        // Fetch companies for the user to match localStorage structure
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { companies: true },
        });

        if (dbUser) {
          // @ts-ignore
          session.user.companies = dbUser.companies;
          // @ts-ignore
          session.user.avatar = dbUser.avatar;
        }
      }
      return session;
    },
  },
});
