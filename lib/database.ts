import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

export function getPrismaClient() {
  if (globalThis.__prisma) {
    return globalThis.__prisma;
  }

  const prisma = new PrismaClient();
  
  if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = prisma;
  }

  return prisma;
}
