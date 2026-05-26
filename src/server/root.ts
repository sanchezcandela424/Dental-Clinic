import { router } from "./trpc";
import { patientsRouter } from "./routers/patients.router"; // src/server/routers/ klasöründe
import { odontogramRouter } from "./routers/odontogram.router"; // src/server/api/routers/ klasöründe

export const appRouter = router({
    patients: patientsRouter,
    odontogram: odontogramRouter,
});

export type AppRouter = typeof appRouter;