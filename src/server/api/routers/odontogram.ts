import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";

export const odontogramRouter = router({
  get: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.odontogramTooth.findMany({
          where: { patientId: input.patientId },
        });
      } catch (err) {
        console.error("GET HATASI:", err); // Hata buraya düşecek!
        throw err;
      }
    }),

  save: protectedProcedure
    .input(
      z.object({
        patientId: z.string(),
        toothNumber: z.number(),
        condition: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.odontogramTooth.upsert({
          where: {
            patientId_toothNumber: {
              patientId: input.patientId,
              toothNumber: input.toothNumber,
            },
          },
          update: {
            condition: input.condition,
            notes: input.notes,
          },
          create: {
            patientId: input.patientId,
            toothNumber: input.toothNumber,
            condition: input.condition,
            notes: input.notes,
          },
        });
      } catch (err) {
        console.error("SAVE HATASI:", err); // Hata buraya düşecek!
        throw err;
      }
    }),
});