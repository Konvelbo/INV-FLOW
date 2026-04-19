import { PrismaClient } from "../p_client";

/**
 * Singleton pattern for Prisma Client to avoid multiple instances in development
 * and ensure stable connections in production (Vercel).
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
