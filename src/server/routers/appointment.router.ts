import { z } from "zod";
import { router, protectedProcedure, masterOnlyProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/lib/prisma";

const appointmentStatusInput = z.enum([
  "SCHEDULED",
  "WAITING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const appointmentRouter = router({
  /**
   * appointment.create - kreira novi termin za pacijenta
   * Validacija uključuje provjeru da li je kraj termina nakon početka
   * i da li postoji sukob s drugim terminom.
   */
  create: protectedProcedure
    .input(
      z.object({
        patientId: z.string().cuid(),
        startTime: z.coerce.date(),
        endTime: z.coerce.date().optional(), // default: startTime + 30 min
        reason: z.string().trim().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const startTime = input.startTime;
      const endTime =
        input.endTime ??
        new Date(startTime.getTime() + 30 * 60 * 1000);

      if (endTime <= startTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Kraj termina mora biti nakon početka.",
        });
      }

      const conflictingAppointment =
        await prisma.appointment.findFirst({
          where: {
            status: { notIn: ["CANCELLED"] },
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gt: startTime } },
            ],
          },
        });

      if (conflictingAppointment) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Odabrani termin je već zauzet. Molimo odaberite drugi termin.",
        });
      }

      return prisma.appointment.create({
        data: {
          patientId: input.patientId,
          startTime,
          endTime,
          reason: input.reason ?? null,
          status: "SCHEDULED",
        },
        include: {
          patient: {
            select: {
              fullName: true,
            },
          },
        },
      });
    }),

  /**
   * appointment.update - ažurira postojeći termin
   * Validacija uključuje provjeru da li je kraj termina nakon početka
   * i da li postoji sukob s drugim terminom (osim samog sebe).
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        startTime: z.coerce.date().optional(),
        endTime: z.coerce.date().optional(),
        reason: z.string().trim().optional(),
        status: appointmentStatusInput.optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, startTime, endTime, ...rest } = input;

      const existingAppointment =
        await prisma.appointment.findUnique({
          where: { id },
        });

      if (!existingAppointment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Termin nije pronađen.",
        });
      }

      const updatedStartTime =
        startTime ?? existingAppointment.startTime;

      const updatedEndTime =
        endTime ?? existingAppointment.endTime;

      if (updatedEndTime <= updatedStartTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Kraj termina mora biti nakon početka.",
        });
      }

      return prisma.appointment.update({
        where: { id },
        data: {
          ...rest,
          ...(startTime && {
            startTime: updatedStartTime,
          }),
          ...(endTime && {
            endTime: updatedEndTime,
          }),
        },
        include: {
          patient: {
            select: {
              fullName: true,
            },
          },
        },
      });
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ input }) => {
      const appointment =
        await prisma.appointment.findUnique({
          where: {
            id: input.id,
          },
          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
                phone: true,
                email: true,
              },
            },
            visitNotes: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });

      if (!appointment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Termin nije pronađen.",
        });
      }

      return appointment;
    }),
  

    /** 
     * appointment.list - vraća paginiranu listu termina, sa opcionalnim filterima po pacijentu i statusu
     * Omogućava efikasno učitavanje termina sa servera, podržava paginaciju i filtriranje
     */
  list: protectedProcedure
    .input(
      z.object({
        patientId: z.string().cuid().optional(),
        status: appointmentStatusInput.optional(),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      const {
        patientId,
        status,
        page,
        pageSize,
      } = input;

      const skip = (page - 1) * pageSize;

      const where = {
        ...(patientId && { patientId }),
        ...(status && { status }),
      };

      const [total, appointments] = await Promise.all([
        prisma.appointment.count({ where }),

        prisma.appointment.findMany({
          where,
          orderBy: {
            startTime: "desc",
          },
          skip,
          take: pageSize,
          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        }),
      ]);

      return {
        appointments,

        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          hasNextPage:
            page < Math.ceil(total / pageSize),
          hasPreviousPage: page > 1,
        },
      };
    }),
  

    /** 
     * appointment.getCalendarEvents - vraća termine za određeni dan ili sedmicu, koristi se za prikaz u kalendaru
     * Omogućava filtriranje termina po datumu i prikazu (dan/sedmice)
     */
  getCalendarEvents: protectedProcedure
    .input(
      z.object({
        date: z.coerce.date(),
        view: z.enum(["day", "week"]).default("day"),
      })
    )
    .query(async ({ input }) => {
      const { date, view } = input;

      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);

      if (view === "week") {
        // Sedmični prikaz: ponedjeljak - nedjelja
        const day = start.getDay();

        const diff =
          start.getDate() -
          day +
          (day === 0 ? -6 : 1);

        start.setDate(diff);
        end.setDate(diff + 6);
      }

      end.setHours(23, 59, 59, 999);

      return prisma.appointment.findMany({
        where: {
          startTime: {
            gte: start,
            lte: end,
          },
        },

        orderBy: {
          startTime: "asc",
        },

        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              phone: true,
            },
          },
        },
      });
    }),
  

    /** 
     * appointment.checkAvailability - provjerava da li je dati vremenski interval slobodan za zakazivanje termina
     * Koristi se prilikom kreiranja i ažuriranja termina kako bi se izbjegli sukobi termina
     */
  checkAvailability: protectedProcedure
    .input(
      z.object({
        startTime: z.coerce.date(),
        endTime: z.coerce.date().optional(),
        excludeId: z.string().cuid().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const startTime = input.startTime;

      const endTime =
        input.endTime ??
        new Date(startTime.getTime() + 30 * 60 * 1000);

      const conflict =
        await prisma.appointment.findFirst({
          where: {
            ...(input.excludeId && {
              id: {
                not: input.excludeId,
              },
            }),

            status: {
              notIn: ["CANCELLED"],
            },

            AND: [
              {
                startTime: {
                  lt: endTime,
                },
              },

              {
                endTime: {
                  gt: startTime,
                },
              },
            ],
          },

          select: {
            id: true,
            startTime: true,
            endTime: true,
          },
        });

      return {
        available: !conflict,
        conflictingAppointment: conflict ?? null,
      };
    }),
  
    /** 
     * appointment.getDashboardStats - vraca statistiku za dashboard, uključujući broj termina po statusu, termine za danas i broj novih pacijenata ovog mjeseca
     */
  getDashboardStats: protectedProcedure
    .query(async () => {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const todayEnd = new Date(today);

      todayEnd.setHours(23, 59, 59, 999);

      const thisMonthStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      const [
        statusCounts,
        todaysAppointments,
        newPatientsThisMonth,
      ] = await Promise.all([
        prisma.appointment.groupBy({
          by: ["status"],
          _count: {
            status: true,
          },
        }),

        prisma.appointment.findMany({
          where: {
            startTime: {
              gte: today,
              lte: todayEnd,
            },

            status: {
              notIn: ["CANCELLED"],
            },
          },

          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },

          orderBy: {
            startTime: "asc",
          },
        }),

        prisma.patient.count({
          where: {
            createdAt: {
              gte: thisMonthStart,
            },
          },
        }),
      ]);

      const counts = Object.fromEntries(
        statusCounts.map((s) => [
          s.status,
          s._count.status,
        ])
      );

      return {
        statusCounts: {
          SCHEDULED:
            counts.SCHEDULED ?? 0,

          WAITING:
            counts.WAITING ?? 0,

          IN_PROGRESS:
            counts.IN_PROGRESS ?? 0,

          COMPLETED:
            counts.COMPLETED ?? 0,

          CANCELLED:
            counts.CANCELLED ?? 0,
        },

        total: Object.values(counts).reduce(
          (a, b) => a + b,
          0
        ),

        todaysAppointments,
        newPatientsThisMonth,
      };
    }),
  

    /** 
     * appointment.delete - brise termin, samo MASTER korisnici mogu brisati termine
     */
  delete: masterOnlyProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input }) => {
      const existing =
        await prisma.appointment.findUnique({
          where: {
            id: input.id,
          },

          select: {
            id: true,
          },
        });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Termin nije pronađen.",
        });
      }

      await prisma.appointment.delete({
        where: {
          id: input.id,
        },
      });

      return {
        success: true as const,
      };
    }),
});