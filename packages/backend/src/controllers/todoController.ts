import { isNull } from "drizzle-orm";
import Elysia from "elysia";
import db from "../db";
import { todos } from "../db/schema";

const todoController = new Elysia({ prefix: "/api/todo" }).get(
  "/",
  async () => {
    const todosList = await db.query.todos.findMany({
      columns: {
        deletedAt: false,
      },
      with: {
        user: true,
      },
      where: isNull(todos.deletedAt),
    });
    return todosList;
  },
);

export default todoController;
