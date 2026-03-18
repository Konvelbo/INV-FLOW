import { auth } from "@/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

export interface UnifiedSession {
  userId: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  companies?: any[];
}

export async function getServerSession(): Promise<UnifiedSession | null> {
  // 1. Try NextAuth (Google Login)
  try {
    const session = await auth();
    if (session?.user?.id) {
      return {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        avatar: (session.user as any).avatar || session.user.image,
        companies: (session.user as any).companies || [],
      };
    }
  } catch (error) {
    console.error("NextAuth session check failed:", error);
  }

  // 2. Try custom cookie (Email/Password Login)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      if (decoded?.id) {
        // Fetch user from DB to get name/email/companies
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          include: { companies: true },
        });

        if (user) {
          return {
            userId: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            companies: user.companies,
          };
        }
      }
    }
  } catch (error) {
    // Token expired or invalid
    console.error("Custom session check failed:", error);
  }

  return null;
}
