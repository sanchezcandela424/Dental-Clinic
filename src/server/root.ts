import { router } from "./trpc";
import { patientsRouter } from "./routers/patients.router"; // src/server/routers/ klasöründe
import { odontogramRouter } from "./api/routers/odontogram"; // src/server/api/routers/ klasöründe

export const appRouter = router({
    patients: patientsRouter,
    odontogram: odontogramRouter,
});

export type AppRouter = typeof appRouter;