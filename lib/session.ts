import jwt from "jsonwebtoken";

export interface UnifiedSession {
  userId: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  companies?: any[];
}

export async function getServerSession(): Promise<UnifiedSession | null> {
  // 1. Try custom cookie (Email/Password Login) - ONLY ON SERVER
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { cookies } = require("next/headers");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { prisma } = require("./prisma");

      const cookieStore = await cookies();
      const token = cookieStore.get("auth-token")?.value;

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        if (decoded?.id) {
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
      if ((error as any)?.code !== 'NEXT_STATIC_GEN_BAILOUT') {
        console.error("Custom session check failed:", error);
      }
    }
  }

  // 2. Client-side fallback (for Electron Output: Export)
  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.id) {
          return {
            userId: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            companies: user.companies || [],
          };
        }
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
    }
  }

  return null;
}
