import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { statusRouter } from "./status";
import { replyRouter } from "./reply";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  status: statusRouter,
  reply: replyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
