import cors from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { sql } from "drizzle-orm";
import { type Context, Elysia, ValidationError } from "elysia";
import logixlysia from "logixlysia";
import z from "zod";
import todoController from "./controllers/todoController";
import db from "./db";
import { auth } from "./utils/auth";
import env from "./utils/env";

const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    return context.status(404, "Not Found");
  }
};

const app = new Elysia()
  .use(
    cors({
      origin: env.ALLOWED_CORS_ORIGIN,
    }),
  )
  .use(
    openapi({
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
    }),
  )
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
  .onError(({ error, status }) => {
    if (error instanceof ValidationError) {
      return status(400, {
        message: JSON.parse(error.message)
          // biome-ignore lint/suspicious/noExplicitAny: error handling
          .errors.map((err: any) => err.message)
          .join(", "),
      });
    }
    // biome-ignore lint/suspicious/noExplicitAny: error handling
    if ((error as any).cause?.errno === "22P02") {
      return status(404, { message: "Resource not found" });
    }
  })
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
