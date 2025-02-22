/**
 * @file personal-expenses-schema.ts
 * @description
 * Defines the schema for the "personal_expenses" table, which tracks expenses
 * that do not directly relate to professional costs. These expenses reduce
 * net monthly income but do not reduce taxable income for the business side.
 *
 * Table Fields:
 *  - id (UUID): Primary key, auto-generated
 *  - userId (text): The Clerk user ID of the therapist
 *  - description (text): Short description of the personal expense
 *  - cost (numeric): The expense amount in currency with two decimals
 *  - createdAt (timestamp): Timestamp of record creation
 *  - updatedAt (timestamp): Timestamp of last update, automatically updated
 *
 * Exports:
 *  - personalExpensesTable: The Drizzle table definition
 *  - InsertPersonalExpense: Type for inserting a new personal expense
 *  - SelectPersonalExpense: Type for selecting a personal expense
 *
 * @dependencies
 *  - drizzle-orm/pg-core
 *
 * @notes
 *  - "cost" is stored with numeric(10,2) for monetary values
 */

import {
  pgTable,
  text,
  numeric,
  timestamp,
  uuid,
  integer
} from "drizzle-orm/pg-core"

/**
 * Defines the "personal_expenses" table, storing non-business (personal) expense info.
 */
export const personalExpensesTable = pgTable("personal_expenses", {
  /**
   * UUID primary key
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * The Clerk user ID of the therapist
   */
  userId: text("user_id").notNull(),

  /**
   * Description of the personal expense
   */
  description: text("description").notNull(),

  /**
   * Monetary cost of this personal expense in cents
   */
  cost: integer("cost").default(0).notNull(),

  /**
   * Record creation timestamp
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Record update timestamp (auto-updates on changes)
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new personal expense record.
 */
export type InsertPersonalExpense = typeof personalExpensesTable.$inferInsert

/**
 * Type for selecting a personal expense record.
 */
export type SelectPersonalExpense = typeof personalExpensesTable.$inferSelect
