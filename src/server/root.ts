import { router } from "./trpc";
import { patientsRouter } from "./routers/patients.router";

export const appRouter = router({
    patients: patientsRouter,
});

export type AppRouter = typeof appRouter;