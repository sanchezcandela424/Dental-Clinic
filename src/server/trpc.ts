import { initTRPC, TRPCError } from "@trpc/server";
export type UserRole = "MASTER" | "STAFF";

export type Context = {
    user: {
        id: string;
        role: UserRole;
    } | null;
};

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

    return next({
        ctx: {
            user: ctx.user,
        },
    });
});

const isMaster = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
        });
    }

    if (ctx.user.role !== "MASTER") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Master access required",
        });
    }

    return next({
        ctx,
    });
});


export const protectedProcedure = t.procedure.use(isAuthed);
export const masterOnlyProcedure = t.procedure.use(isMaster);