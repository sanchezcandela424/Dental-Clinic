import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "~/lib/prisma";
import { router, protectedProcedure, masterOnlyProcedure } from "../trpc";

const appointmentStatusInput = z.enum([
    "SCHEDULED",
    "WAITING",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
]);
async function checkOverlap(params: {
    startTime: Date;
    endTime: Date;
    excludeId?: string;
}) {
    return prisma.appointment.findFirst({
        where: {
            ...(params.excludeId && {
                id: { not: params.excludeId },
            }),
            status: { notIn: ["CANCELLED"] },
            AND: [
                { startTime: { lt: params.endTime } },
                { endTime: { gt: params.startTime } },
            ],
        },
    });
}

export const appointmentRouter = router({

    /**
     * appointment.create - kreira novi termin za pacijenta
     * Validacija uključuje provjeru da li je kraj termina nakon početka
     * i da li postoji sukob s drugim terminom.
     */
    create: protectedProcedure
        .input(
            z.object({
                patientId: z
                    .string()
                    .cuid("Molimo odaberite pacijenta."),
                startTime: z.coerce.date(),
                endTime: z.coerce.date().optional(),
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

            const conflictingAppointment = await checkOverlap({
                startTime,
                endTime,
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
            const existingAppointment =
                await prisma.appointment.findUnique({
                    where: { id: input.id },
                });

            if (!existingAppointment) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Termin nije pronađen.",
                });
            }

            const updatedStartTime =
                input.startTime ?? existingAppointment.startTime;

            const updatedEndTime =
                input.endTime ?? existingAppointment.endTime;

            if (updatedEndTime <= updatedStartTime) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Kraj termina mora biti nakon početka.",
                });
            }

            // FIX: prevent overlap on update (was missing)
            const conflict = await checkOverlap({
                startTime: updatedStartTime,
                endTime: updatedEndTime,
                excludeId: input.id,
            });

            if (conflict) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Termin se preklapa sa drugim terminom.",
                });
            }

            return prisma.appointment.update({
                where: { id: input.id },
                data: {
                    ...input,
                    startTime: input.startTime ?? undefined,
                    endTime: input.endTime ?? undefined,
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
     * appointment.getById - vraća kompletne podatke o terminu
     */
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
     * appointment.list - vraća paginiranu listu termina
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
            const skip = (input.page - 1) * input.pageSize;

            const where = {
                ...(input.patientId && { patientId: input.patientId }),
                ...(input.status && { status: input.status }),
            };

            const [total, appointments] = await Promise.all([
                prisma.appointment.count({ where }),
                prisma.appointment.findMany({
                    where,
                    orderBy: {
                        startTime: "desc",
                    },
                    skip,
                    take: input.pageSize,
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
                    page: input.page,
                    pageSize: input.pageSize,
                    totalPages: Math.ceil(total / input.pageSize),
                    hasNextPage:
                        input.page < Math.ceil(total / input.pageSize),
                    hasPreviousPage: input.page > 1,
                },
            };
        }),

    /**
     * appointment.getCalendarEvents - vraća termine za određeni dan ili sedmicu
     */
    getCalendarEvents: protectedProcedure
        .input(
            z.object({
                date: z.coerce.date(),
                view: z.enum(["day", "week"]).default("day"),
            })
        )
        .query(async ({ input }) => {
            const start = new Date(input.date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(input.date);

            if (input.view === "week") {
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
     * appointment.checkAvailability - provjerava da li je termin slobodan
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

            const conflict = await checkOverlap({
                startTime,
                endTime,
                excludeId: input.excludeId,
            });

            return {
                available: !conflict,
                conflictingAppointment: conflict ?? null,
            };
        }),

    /**
     * appointment.getDashboardStats - statistika za dashboard
     */
    getDashboardStats: protectedProcedure.query(async () => {
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
     * appointment.delete - brise termin
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