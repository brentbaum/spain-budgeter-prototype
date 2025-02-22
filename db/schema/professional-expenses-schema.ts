/**
 * @file professional-expenses-schema.ts
 * @description
 * Defines the schema for the "professional_expenses" table, which tracks expenses
 * related to the business/therapist's professional activities. These expenses
 * reduce taxable income for the business.
 *
 * Table Fields:
 *  - id (UUID): Primary key, auto-generated
 *  - userId (text): The Clerk user ID of the therapist
 *  - description (text): Description of the professional expense
 *  - cost (numeric): The expense amount in currency with two decimals
 *  - createdAt (timestamp): Timestamp of record creation
 *  - updatedAt (timestamp): Timestamp of last update
 *
 * Exports:
 *  - professionalExpensesTable: The Drizzle table definition
 *  - InsertProfessionalExpense: Type for inserting a new professional expense
 *  - SelectProfessionalExpense: Type for selecting a professional expense
 *
 * @dependencies
 *  - drizzle-orm/pg-core
 *
 * @notes
 *  - "cost" is stored as numeric(10,2) for monetary values
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
 * Defines the "professional_expenses" table, storing business-related expenses.
 */
export const professionalExpensesTable = pgTable("professional_expenses", {
  /**
   * UUID primary key
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * The Clerk user ID of the therapist
   */
  userId: text("user_id").notNull(),

  /**
   * Description of the professional expense
   */
  description: text("description").notNull(),

  /**
   * Monetary cost of this professional expense
   */
  cost: integer("cost").default(0).notNull(),

  /**
   * Creation timestamp
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Last update timestamp (auto-updates on changes)
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new professional expense record.
 */
export type InsertProfessionalExpense =
  typeof professionalExpensesTable.$inferInsert

/**
 * Type for selecting a professional expense record.
 */
export type SelectProfessionalExpense =
  typeof professionalExpensesTable.$inferSelect
