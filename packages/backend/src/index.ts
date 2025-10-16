import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import env from "./utils/env";

const app = new Elysia()
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .listen(env.PORT ?? 3000);

// biome-ignore lint/suspicious/noConsole:intentional
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
