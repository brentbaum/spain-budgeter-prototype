/**
 * @file calculation-actions.ts
 * @description Server actions for computing monthly budget & taxes for a therapist.
 *
 * Exports:
 *   - calculateBudgetAction(userId): 
 *     1) Gathers data from clientsTable, personalExpensesTable, professionalExpensesTable, and therapistSettingsTable
 *     2) Summarizes monthly gross, VAT, IRPF, net income
 *     3) Compares 6-month projected savings with user’s 6-month goal
 * 
 * @notes
 * - The IRPF bracket logic is approximate, based on an annual gross -> bracket approach. 
 * - The returned data is typed as 'any' in the ActionState but can be refined using a TS interface if needed.
 * 
 * @dependencies
 *  - db from "@/db/db"
 *  - eq from "drizzle-orm"
 *  - ActionState from "@/types"
 *  - clientsTable from "@/db/schema/clients-schema"
 *  - personalExpensesTable from "@/db/schema/personal-expenses-schema"
 *  - professionalExpensesTable from "@/db/schema/professional-expenses-schema"
 *  - therapistSettingsTable from "@/db/schema/therapist-settings-schema"
 */

"use server"

import { db } from "@/db/db"
import { clientsTable } from "@/db/schema/clients-schema"
import { personalExpensesTable } from "@/db/schema/personal-expenses-schema"
import { professionalExpensesTable } from "@/db/schema/professional-expenses-schema"
import { therapistSettingsTable } from "@/db/schema/therapist-settings-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"

/**
 * calculateBudgetAction
 * 
 * @param userId The user's ID
 * @returns 
 *   ActionState of an object containing:
 *   {
 *     grossIncome: number,
 *     vat: number,
 *     irpfRate: number,
 *     incomeTax: number,
 *     totalProfessional: number,
 *     totalPersonal: number,
 *     netIncome: number,
 *     projectedSavings: number,
 *     savingsGoal: number,
 *     difference: number
 *   }
 * 
 * Steps:
 *   1. Gross income from all clients (sessionRate * monthlySessions)
 *   2. VAT = 21% of gross
 *   3. IRPF bracket:
 *        - annualGross <= 12450 => 19%
 *        - <= 20200 => 24%
 *        - <= 35200 => 30%
 *        - <= 60000 => 37%
 *        - else => 45%
 *   4. monthly incomeTax = monthlyGross * IRPF rate
 *   5. totalProfessional = sum of all professional expenses
 *   6. totalPersonal = sum of all personal expenses
 *   7. netIncome = grossIncome - totalProfessional - incomeTax - vat - totalPersonal
 *   8. projectedSavings = netIncome * 6
 *   9. savingsGoal = monthlySavingsGoal * 6
 *   10. difference = projectedSavings - savingsGoal
 */
export async function calculateBudgetAction(
  userId: string
): Promise<
  ActionState<{
    grossIncome: number
    vat: number
    irpfRate: number
    incomeTax: number
    totalProfessional: number
    totalPersonal: number
    netIncome: number
    projectedSavings: number
    savingsGoal: number
    difference: number
  }>
> {
  try {
    // 1. Get gross income
    const clients = await db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.userId, userId))

    const grossIncome = clients.reduce((acc, c) => {
      const monthlySessions = Number(c.monthlySessions) || 0
      const sessionRate = Number(c.sessionRate) || 0
      return acc + monthlySessions * sessionRate
    }, 0)

    // 2. 21% VAT
    const vat = grossIncome * 0.21

    // 3. IRPF bracket
    const annualIncome = grossIncome * 12
    let irpfRate = 0

    if (annualIncome <= 12450) {
      irpfRate = 0.19
    } else if (annualIncome <= 20200) {
      irpfRate = 0.24
    } else if (annualIncome <= 35200) {
      irpfRate = 0.30
    } else if (annualIncome <= 60000) {
      irpfRate = 0.37
    } else {
      irpfRate = 0.45
    }

    // 4. monthly income tax
    const incomeTax = grossIncome * irpfRate

    // 5. sum professional expenses
    const professional = await db
      .select()
      .from(professionalExpensesTable)
      .where(eq(professionalExpensesTable.userId, userId))

    const totalProfessional = professional.reduce(
      (acc, e) => acc + Number(e.cost),
      0
    )

    // sum personal expenses
    const personal = await db
      .select()
      .from(personalExpensesTable)
      .where(eq(personalExpensesTable.userId, userId))

    const totalPersonal = personal.reduce((acc, e) => acc + Number(e.cost), 0)

    // 6. netIncome
    const netIncome =
      grossIncome - totalProfessional - incomeTax - vat - totalPersonal

    // 7. get user settings
    const [settings] = await db
      .select()
      .from(therapistSettingsTable)
      .where(eq(therapistSettingsTable.userId, userId))

    const monthlySavingsGoal = Number(settings?.monthlySavingsGoal || 0)
    const savingsGoal = monthlySavingsGoal * 6
    const projectedSavings = netIncome * 6
    const difference = projectedSavings - savingsGoal

    // Return final result
    return {
      isSuccess: true,
      message: "Budget calculated successfully",
      data: {
        grossIncome,
        vat,
        irpfRate,
        incomeTax,
        totalProfessional,
        totalPersonal,
        netIncome,
        projectedSavings,
        savingsGoal,
        difference
      }
    }
  } catch (error) {
    console.error("Error calculating budget:", error)
    return { isSuccess: false, message: "Failed to calculate budget" }
  }
}