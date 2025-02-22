/**
 * @file clients-schema.ts
 * @description
 * This file defines the schema for the "clients" table using Drizzle ORM and PostgreSQL.
 * It stores client data for each therapist, including monthly sessions and session rate,
 * which is used to calculate gross monthly income.
 *
 * Table Fields:
 *  - id (UUID): Primary key, auto-generated
 *  - userId (text): The Clerk user ID of the therapist
 *  - name (text): Name of the client
 *  - monthlySessions (integer): Number of sessions per month for this client
 *  - sessionRate (numeric): Rate charged per session
 *  - createdAt (timestamp): Timestamp of creation
 *  - updatedAt (timestamp): Timestamp of last update, automatically updated
 *
 * Exports:
 *  - clientsTable: The Drizzle table definition
 *  - InsertClient: Type for inserting a new client row
 *  - SelectClient: Type for selecting a client row
 *
 * @dependencies
 *  - drizzle-orm/pg-core for pgTable, text, integer, numeric, timestamp, uuid
 *
 * @notes
 *  - We use numeric(10,2) for monetary values to handle up to 2 decimal places
 *  - We rely on the userId from Clerk to link each record to a specific therapist
 */

import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  uuid
} from "drizzle-orm/pg-core"

/**
 * Defines the "clients" table, storing basic info about each therapist's clients.
 */
export const clientsTable = pgTable("clients", {
  /**
   * Unique ID for each client entry
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * The Clerk user ID of the therapist
   */
  userId: text("user_id").notNull(),

  /**
   * Client's name
   */
  name: text("name").notNull(),

  /**
   * Number of sessions per month
   */
  monthlySessions: integer("monthly_sessions").default(0).notNull(),

  /**
   * Session rate in cents, 10 dollars is 1000.
   */
  sessionRate: integer("session_rate").default(0).notNull(),

  /**
   * Timestamp of creation
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Timestamp of update, automatically updated on modification
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new client record.
 */
export type InsertClient = typeof clientsTable.$inferInsert

/**
 * Type for selecting an existing client record.
 */
export type SelectClient = typeof clientsTable.$inferSelect
