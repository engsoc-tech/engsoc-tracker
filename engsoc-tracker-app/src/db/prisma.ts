import { PrismaClient } from '@prisma/client';
const prismaClientSingleton = () => {
    return new PrismaClient();
}
const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
export default prisma;
if (process.env.NODEENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
export const prismaClient = prisma;