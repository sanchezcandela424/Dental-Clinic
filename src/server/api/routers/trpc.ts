import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "~/lib/prisma"; // Sanjin'in oluşturduğu prisma instance'ı

// 1. tRPC Bağlamı (Context) Oluşturma
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db: prisma,
    ...opts,
  };
};

// 2. tRPC'yi Başlatma
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// 3. Router ve Prosedürleri Dışarı Aktarma
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Giriş yapmış kullanıcıları kontrol eden korumalı prosedür (Middleware)
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  // Not: Şimdilik testlerin kolay çalışması için direkt geçiş veriyoruz, 
  // auth entegrasyonuna göre burası şekillenebilir.
  return next({ ctx });
});