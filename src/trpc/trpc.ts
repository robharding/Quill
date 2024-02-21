import { validateRequest } from "@/lib/auth";
import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.create();
const middleware = t.middleware;

// could be using trpc context as well, but not necessary because
// we dont need the user outside of private procedures
const isAuth = middleware(async (opts) => {
  const { user } = await validateRequest();

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
