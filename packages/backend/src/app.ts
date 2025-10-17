import openapi from "@elysiajs/openapi";
import { sql } from "drizzle-orm";
import { type Context, Elysia } from "elysia";
import logixlysia from "logixlysia";
import z from "zod";
import todoController from "./controllers/todoController";
import db from "./db";
import { auth } from "./utils/auth";

const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    return context.status(404, "Not Found");
  }
};

const app = new Elysia()
  .use(openapi())
  .use(
    logixlysia({
      config: {
        showStartupMessage: true,
        startupMessageFormat: "simple",
        timestamp: {
          translateTime: "dd-mm-yyyy HH:MM:ss",
        },
        ip: true,
      },
    }),
  )
  .all("/api/auth/*", betterAuthView)
  .get(
    "/api/healthcheck",
    async () => {
      type status = "ok" | "error";
      try {
        await db.execute(sql`SELECT 1;`);
        return {
          status: "ok" as status,
        };
      } catch {
        return {
          status: "error" as status,
        };
      }
    },
    {
      response: z.object({
        status: z.enum(["ok", "error"]),
      }),
    },
  )
  .use(todoController);

export default app;
