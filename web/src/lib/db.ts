import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function mysqlEnabled() {
  return process.env.USE_MYSQL === "true" && Boolean(process.env.DATABASE_URL);
}

export function getPrisma() {
  if (!mysqlEnabled()) return null;
  globalForPrisma.prisma ??= new PrismaClient();
  return globalForPrisma.prisma;
}
