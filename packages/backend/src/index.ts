import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

// biome-ignore lint/suspicious/noConsole:intentional
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
