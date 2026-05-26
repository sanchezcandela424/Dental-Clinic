import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import superjson from "superjson";
import { authOptions } from "~/lib/auth";
import { prisma as db } from "../lib/prisma";

export type UserRole = "MASTER" | "STAFF";

export type Context = {
    user: {
        id: string;
        email: string;
        role: UserRole;
    } | null;
    db: typeof db;
};

export async function createTRPCContext(opts: { req: Request }): Promise<Context> {
    const session = await getServerSession(authOptions);

    return {
        user: session?.user ? {
            id: session.user.id,
            email: session.user.email ?? "",
            role: session.user.role,
        } : null,
        db,
    };
}

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

// Orta kısımda duran tüm mükerrer router ve procedure tanımlarını kaldırdık.
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

// SADECE EN ALTTA TEK BİR SEFER TANIMLIYORUZ:
export const router = t.router;
export const createTRPCRouter = t.router; // Hem router hem createTRPCRouter kullanan dosyalar için ikisini de destekliyoruz
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const masterOnlyProcedure = t.procedure.use(isMaster);