import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const patientRouter = createTRPCRouter({
  // Query to handle advanced search, server-side pagination, and dynamic sorting
  getPaginated: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(10),
        sortBy: z.enum(["fullName", "createdAt", "dateOfBirth"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, limit, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      // Build dynamic case-insensitive search filter for fullName, jmb, and phone
      const whereClause = search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { jmb: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {};

      // Execute both count and data queries concurrently for better Neon performance
      const [totalCount, patients] = await Promise.all([
        ctx.db.patient.count({ where: whereClause }),
        ctx.db.patient.findMany({
          where: whereClause,
          skip: skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
      ]);

      // Calculate total number of pages
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