DROP INDEX "todo_deletedAt_idx";--> statement-breakpoint
CREATE INDEX "todo_deletedAt_idx" ON "todos" USING btree ("deletedAt","userId");