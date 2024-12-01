import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  unique,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  password: text("password").notNull(),
  email: varchar("email").notNull().unique(),
  isVerified: boolean("is_verified").default(false),
});

export const directories = pgTable(
  "directories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 15 }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
  },
  (table) => ({
    uniqueUserDirectory: unique("unique_user_directory").on(
      table.userId,
      table.name
    ),
  })
);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 25 }).notNull(),
  description: varchar("description", { length: 80 }),
  deadline: timestamp("deadline").notNull(),
  isImportant: boolean("is_important").default(false),
  isCompleted: boolean("is_completed").default(false),
  directoryId: integer("directory_id")
    .notNull()
    .references(() => directories.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const verifyToken = pgTable(
  "verify_token",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expDate: timestamp("exp_date")
      .notNull()
      .default(sql`NOW() + INTERVAL '10 minutes'`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.token] }),
  })
);

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
