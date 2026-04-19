import { PrismaClient } from "../p_client";

/**
 * Optimized Prisma Singleton for Next.js 15 + Vercel.
 * This pattern ensures that we don't exhaust database connections
 * during hot reloads in development, and provides a stable client in production.
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
