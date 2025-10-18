import { and, desc, eq, isNull } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod";
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
  })
  .get(
    "/:id",
    async ({ params, user, status }) => {
      const todoItem = await db.query.todos.findFirst({
        where: and(
          eq(todos.id, params.id),
          isNull(todos.deletedAt),
          eq(todos.userId, user.id),
        ),
        columns: {
          deletedAt: false,
        },
        with: {
          user: true,
        },
      });

      if (!todoItem) {
        return status(404, { message: "Todo not found" });
      }
      return todoItem;
    },
    {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
  )
  .post(
    "/",
    async ({ body, user, status }) => {
      const [newTodo] = await db
        .insert(todos)
        .values({
          ...body,
          userId: user.id,
        })
        .returning();
      status(201);
      return newTodo;
    },
    {
      body: z.object({
        title: z.string(),
        dueDate: z.coerce.date().optional(),
      }),
    },
  )
  .put(
    "/:id",
    async ({ params, body, user, status }) => {
      const [updatedTodo] = await db
        .update(todos)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(todos.id, params.id),
            isNull(todos.deletedAt),
            eq(todos.userId, user.id),
          ),
        )
        .returning();

      if (!updatedTodo) {
        return status(404, { message: "Todo not found" });
      }

      return updatedTodo;
    },
    {
      params: z.object({
        id: z.uuid(),
      }),
      body: z.object({
        title: z.string().optional(),
        done: z.boolean().optional(),
        dueDate: z.coerce.date().optional().nullable(),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params, user, status }) => {
      const [todoItem] = await db
        .update(todos)
        .set({
          deletedAt: new Date(),
        })
        .where(
          and(
            eq(todos.id, params.id),
            isNull(todos.deletedAt),
            eq(todos.userId, user.id),
          ),
        )
        .returning();

      if (!todoItem) {
        return status(404, { message: "Todo not found" });
      }

      return status(204);
    },
    {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
  );

export default todoController;
