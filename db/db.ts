/**
 * @file db.ts
 * @description
 * Initializes the database connection using Drizzle ORM over Postgres.js.
 * Exports a `db` instance bound to the combined schema.
 *
 * This file merges the old schemas (profiles, todos) with newly added:
 *   - clientsTable
 *   - personalExpensesTable
 *   - professionalExpensesTable
 *   - therapistSettingsTable
 *
 * @dependencies
 *  - postgres from "postgres"
 *  - drizzle from "drizzle-orm/postgres-js"
 *  - config from "dotenv"
 *  - Database schemas from ./schema
 *
 * @notes
 *  - Make sure to have the .env.local with DATABASE_URL
 *  - The schema object is used for type-safe referencing in queries
 */

import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import {
  profilesTable,
  todosTable,
  clientsTable,
  personalExpensesTable,
  professionalExpensesTable,
  therapistSettingsTable
} from "@/db/schema"

config({ path: ".env.local" })

/**
 * The combined schema object for all of our tables, to be used for Drizzle queries.
 */
const schema = {
  profiles: profilesTable,
  todos: todosTable,
  clients: clientsTable,
  personalExpenses: personalExpensesTable,
  professionalExpenses: professionalExpensesTable,
  therapistSettings: therapistSettingsTable
}

/**
 * Postgres.js client, reading from process.env.DATABASE_URL
 */
const client = postgres(process.env.DATABASE_URL!)

/**
 * The main Drizzle database instance.
 */
export const db = drizzle(client, { schema })
