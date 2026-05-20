import { patientRouter } from "~/server/api/routers/patient";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * Uygulamanın ana tRPC router yapısı.
 * Oluşturduğun tüm router'ları (patient, appointment vb.) burada birleştireceğiz.
 */
export const appRouter = createTRPCRouter({
  patient: patientRouter, // Yazdığın arama sorgusu artık hazır!
});

// Frontend'in tip güvenliği (Type Safety) için bu export kritik
export type AppRouter = typeof appRouter;