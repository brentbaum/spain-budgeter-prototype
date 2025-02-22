/**
 * @file therapist-settings-actions.ts
 * @description Server actions to manage therapist-specific settings in the DB.
 * 
 * These actions handle reading/updating the "therapist_settings" table, which includes:
 *  - monthlySavingsGoal: numeric
 *  - other future expansions
 * 
 * The main actions are:
 *   - getTherapistSettingsAction: retrieve the row for a given user
 *   - setTherapistSettingsAction: upsert logic for the row (create or update)
 * 
 * @notes
 * - If the user doesn't have a row yet, we create it. Otherwise, we update the existing row.
 * - We only store one row per user, hence userId is the unique constraint.
 * - The data returned from Drizzle is typed as 'any' for demonstration. For stricter typing, see the actual schema type.
 * 
 * @dependencies
 *  - db from "@/db/db"
 *  - therapistSettingsTable from "@/db/schema/therapist-settings-schema"
 *  - eq from "drizzle-orm"
 *  - ActionState from "@/types"
 */

"use server"

import { db } from "@/db/db"
import { therapistSettingsTable } from "@/db/schema/therapist-settings-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"

/**
 * setTherapistSettingsAction
 * @description
 *   Upserts the therapist settings for a given user. If no row found, create one; otherwise update.
 * 
 * @param userId The user's ID
 * @param monthlySavingsGoal The monthly savings goal in numeric form
 * @returns ActionState with updated/created row
 */
export async function setTherapistSettingsAction(
  userId: string,
  monthlySavingsGoal: number
): Promise<ActionState<any>> {
  try {
    // Attempt to find an existing row
    const existing = await db
      .select()
      .from(therapistSettingsTable)
      .where(eq(therapistSettingsTable.userId, userId))

    let result: any

    if (existing.length > 0) {
      // Update
      const [updated] = await db
        .update(therapistSettingsTable)
        .set({ monthlySavingsGoal })
        .where(eq(therapistSettingsTable.userId, userId))
        .returning()

      result = updated
    } else {
      // Insert
      const [inserted] = await db
        .insert(therapistSettingsTable)
        .values({
          userId,
          monthlySavingsGoal
        })
        .returning()

      result = inserted
    }

    return {
      isSuccess: true,
      message: "Therapist settings updated",
      data: result
    }
  } catch (error) {
    console.error("Error setting therapist settings:", error)
    return { isSuccess: false, message: "Failed to set therapist settings" }
  }
}

/**
 * getTherapistSettingsAction
 * @description
 *   Retrieves therapist settings for a given user ID
 * 
 * @param userId The user's ID
 * @returns ActionState with the row if found, otherwise no data
 */
export async function getTherapistSettingsAction(
  userId: string
): Promise<ActionState<any>> {
  try {
    const [settings] = await db
      .select()
      .from(therapistSettingsTable)
      .where(eq(therapistSettingsTable.userId, userId))

    return {
      isSuccess: true,
      message: "Therapist settings fetched",
      data: settings
    }
  } catch (error) {
    console.error("Error retrieving therapist settings:", error)
    return { isSuccess: false, message: "Failed to get therapist settings" }
  }
}