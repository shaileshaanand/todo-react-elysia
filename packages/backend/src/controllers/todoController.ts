import { and, desc, eq, isNull } from "drizzle-orm";
import Elysia from "elysia";
import db from "../db";
import { todos } from "../db/schema";
import context from "../utils/context";

const todoController = new Elysia({ prefix: "/api/todo" })
  .use(context)
  .guard({
    auth: true,
  })
  .get("/", async ({ user }) => {
    const todosList = await db.query.todos.findMany({
      columns: {
        deletedAt: false,
      },
      with: {
        user: true,
      },
      where: and(isNull(todos.deletedAt), eq(todos.userId, user.id)),
      orderBy: desc(todos.createdAt),
    });
    return todosList;
  });

export default todoController;
