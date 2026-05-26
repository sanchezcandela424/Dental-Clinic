import { router } from "./trpc";
import { patientsRouter } from "./routers/patients.router"; // src/server/routers/ klasöründe
import { odontogramRouter } from "./routers/odontogram.router"; // src/server/api/routers/ klasöründe
import { appointmentRouter } from "./routers/appointment.router";
export const appRouter = router({
    patients: patientsRouter,
    odontogram: odontogramRouter,
    appointment: appointmentRouter,
});

export type AppRouter = typeof appRouter;