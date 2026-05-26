import { z } from "zod";
import { router, publicProcedure } from "../trpc"; 

export const appointmentRouter = router({
  // create endpoint'imiz
  create: publicProcedure
    .input(
      z.object({
        patientId: z.string(),
        startTime: z.coerce.date(), // String gelen tarihi otomatik Date objesine çevirir
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Veritabanına yeni randevu ekleme işlemi
      return await ctx.db.appointment.create({
        data: {
          patientId: input.patientId,
          startTime: input.startTime,
          // Bitiş saatini varsayılan olarak 30 dakika sonrası yapıyoruz
          endTime: new Date(input.startTime.getTime() + 30 * 60 * 1000), 
          reason: input.reason ?? "",
          status: "SCHEDULED", // İlk oluşturulduğunda varsayılan durum: Zakazano
        },
      });
    }),
});