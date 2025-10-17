import app from "./app";
import env from "./utils/env";

app.listen(env.PORT ?? 3000);
// biome-ignore lint/suspicious/noConsole:intentional
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
