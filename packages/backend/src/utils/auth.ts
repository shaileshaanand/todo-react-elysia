import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../db";
import env from "./env";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  trustedOrigins: [env.ALLOWED_CORS_ORIGIN],
  emailAndPassword: {
    secret: env.BETTER_AUTH_SECRET,
    enabled: true,
  },
});
