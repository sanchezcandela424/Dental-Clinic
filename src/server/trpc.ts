import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";

export type UserRole = "MASTER" | "STAFF";

export type Context = {
    user: {
        id: string;
        email: string;
        role: UserRole;
    } | null;
};

/**
 * Kreira tRPC context za svaki request.
 * Čita NextAuth sesiju i stavlja korisnika u ctx.user.
 */
export async function createTRPCContext(opts: { req: Request }): Promise<Context> {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { user: null };
    }

    return {
        user: {
            id:    session.user.id,
            email: session.user.email ?? "",
            role:  session.user.role,
        },
    };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in",
        });
    }
    return next({ ctx: { user: ctx.user } });
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