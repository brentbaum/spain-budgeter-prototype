/**
 * @file therapist-settings-schema.ts
 * @description
 * Defines the schema for the "therapist_settings" table, which stores
 * user-specific configuration for the budgeting application, such as
 * the monthly savings goal. This can be used to project 6-month savings.
 *
 * Table Fields:
 *  - id (UUID): Primary key, auto-generated
 *  - userId (text): The Clerk user ID of the therapist
 *  - monthlySavingsGoal (numeric): The monthly savings goal
 *  - createdAt (timestamp): Timestamp of record creation
 *  - updatedAt (timestamp): Timestamp of last update
 *
 * Exports:
 *  - therapistSettingsTable: The Drizzle table definition
 *  - InsertTherapistSettings: Type for inserting new settings
 *  - SelectTherapistSettings: Type for selecting existing settings
 *
 * @dependencies
 *  - drizzle-orm/pg-core
 *
 * @notes
 *  - monthlySavingsGoal is numeric(10,2) to handle typical currency-like values
 */

import { pgTable, text, numeric, timestamp, uuid } from "drizzle-orm/pg-core"

/**
 * Defines the "therapist_settings" table for storing user-specific budget config.
 */
export const therapistSettingsTable = pgTable("therapist_settings", {
  /**
   * UUID primary key
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * The Clerk user ID of the therapist
   */
  userId: text("user_id").notNull(),

  /**
   * The monthly savings goal (numeric, e.g., currency)
   */
  monthlySavingsGoal: numeric("monthly_savings_goal", 10, 2)
    .default("0")
    .notNull(),

  /**
   * Creation timestamp
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Last update timestamp (auto-updates on changes)
   */
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdateNow()
})

/**
 * Type for inserting a new therapist settings record.
 */
export type InsertTherapistSettings = typeof therapistSettingsTable.$inferInsert

/**
 * Type for selecting an existing therapist settings record.
 */
export type SelectTherapistSettings = typeof therapistSettingsTable.$inferSelect