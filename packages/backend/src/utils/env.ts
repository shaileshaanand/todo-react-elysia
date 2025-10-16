import z from "zod";

const env = z
  .object({
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    PORT: z.coerce.number().min(1).max(65535).optional(),
  })
  .parse(process.env);

export default env;
