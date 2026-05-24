import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import superjson from "superjson";
import { authOptions } from "~/lib/auth";
import { prisma as db } from "../lib/prisma";// Veritabanı bağlantını buraya import ediyoruz

export type UserRole = "MASTER" | "STAFF";

export type Context = {
    user: {
        id: string;
        email: string;
        role: UserRole;
    } | null;
    db: typeof db; // Veritabanı artık context'in bir parçası
};

export async function createTRPCContext(opts: { req: Request }): Promise<Context> {
    const session = await getServerSession(authOptions);

    return {
        user: session?.user ? {
            id: session.user.id,
            email: session.user.email ?? "",
            role: session.user.role,
        } : null,
        db, // Artık her procedure (işlem) veritabanına erişebilir
    };
}

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in",
        });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
});

const isMaster = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (ctx.user.role !== "MASTER") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Master access required",
        });
    }
    return next({ ctx });
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const masterOnlyProcedure = t.procedure.use(isMaster);