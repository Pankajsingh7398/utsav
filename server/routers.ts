import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { bookingsRouter } from "./routers/bookings";
import { authRouter } from "./routers/auth";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  bookings: bookingsRouter,
});

export type AppRouter = typeof appRouter;
