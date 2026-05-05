import { PrismaClient } from "@prisma/client";

// singleton pattern za PrismaClient, da se ne kreira više instanci u developmentu (hot reload) i da se koristi jedna globalna instanca u produkciji

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}