import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const patientRouter = createTRPCRouter({
  // Arama ve Sayfalama Yapan Sorgu
  getPaginated: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(), // Arama kelimesi (opsiyonel)
        page: z.number().int().min(1).default(1), // Kaçıncı sayfa
        limit: z.number().int().min(1).max(100).default(10), // Sayfa başına kaç hasta
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, limit } = input;
      const skip = (page - 1) * limit;

      // 1. Arama Koşullarını Dinamik Olarak Oluştur
      // Kullanıcı bir şey yazdıysa; fullName, jmb veya phone alanlarında büyük/küçük harf duyarsız arama yapar.
      const whereClause = search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { jmb: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {};

      // 2. Performans için Toplam Sayıyı ve Hastaları Aynı Anda Veritabanından Çek
      const [totalCount, patients] = await Promise.all([
        ctx.db.patient.count({ where: whereClause }),
        ctx.db.patient.findMany({
          where: whereClause,
          skip: skip,
          take: limit,
          orderBy: { createdAt: "desc" }, // En son kayıt olan hasta en üstte görünür
        }),
      ]);

      // 3. Sayfalama Sayılarını Hesapla
      const totalPages = Math.ceil(totalCount / limit);

      return {
        patients,
        meta: {
          totalCount,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    }),
});