import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  unique,
  text,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  password: text("password").notNull(),
  email: varchar("email", { length: 254 }).unique().notNull(),
  isVerified: boolean("is_verified").default(false),
});

export const directories = pgTable(
  "directories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 20 }).notNull(),
    userId: integer("user_id").notNull(),
  },
  (table) => [
    foreignKey({
      name: "fk_user_directories",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    unique("unique_user_directory").on(table.userId, table.name),
  ]
);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 25 }).notNull(),
  description: varchar("description", { length: 80 }).default(""),
  deadline: timestamp("deadline").notNull(),
  isImportant: boolean("is_important").default(false),
  isCompleted: boolean("is_completed").default(false),
  directoryId: integer("directory_id")
    .references(() => directories.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const verifyToken = pgTable("verify_token", {
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull(),
  expDate: timestamp("exp_date")
    .default(sql`NOW() + INTERVAL '10 minutes'`)
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  directories: many(directories),
}));

export const directoriesRelations = relations(directories, ({ one, many }) => ({
  user: one(users, {
    fields: [directories.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  directory: one(directories, {
    fields: [tasks.directoryId],
    references: [directories.id],
  }),
}));
