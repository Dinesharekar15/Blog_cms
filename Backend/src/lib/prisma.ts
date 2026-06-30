import { PrismaClient  } from "@prisma/client";

const globalForPrisma=global as unknown as{
    prisma:PrismaClient| undefined;
}

export const prisma=globalForPrisma.prisma??
new PrismaClient({
    log:["error","warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL!, // non-null: validated at runtime via DATABASE_URL in .env
      },
    },
})

if(process.env.NODE_ENV!=="production"){
    globalForPrisma.prisma=prisma
}