import { router } from "./trpc";
import { patientsRouter } from "./routers/patients.router"; // src/server/routers/ klasöründe
import { odontogramRouter } from "./routers/odontogram.router"; // src/server/api/routers/ klasöründe
import { appointmentRouter } from "./routers/appointment.router";
import { visitNotesRouter } from "./routers/visit-notes.router";
import { invoiceRouter } from "./routers/invoice.router";
export const appRouter = router({
  patients: patientsRouter,
  odontogram: odontogramRouter,
  appointment: appointmentRouter,
  visitNotes: visitNotesRouter,
  invoice: invoiceRouter,
});

export type AppRouter = typeof appRouter;