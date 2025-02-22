/**
 * @file page.tsx
 * @description
 *   This server component is the main page for the "/budget" route. It shows
 *   the monthly net income, VAT, IRPF, and 6-month projections.
 *   It calls calculateBudgetAction(userId) to gather data, then passes that
 *   data to a client component "BudgetSummary" for display.
 *
 * Steps:
 *   1. Authenticate the user with Clerk (auth()).
 *   2. If userId is absent, redirect to /login.
 *   3. Call calculateBudgetAction to get budget calculations.
 *   4. Render a heading and <BudgetSummary> client component.
 *
 * @notes
 *   - Must be "use server" because it's a server component.
 *   - We rely on the existing server action "calculateBudgetAction" found in "actions/db/calculation-actions.ts".
 *   - We ensure "isSuccess" is true before rendering the summary. If there's an error, we show an error message.
 */

"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { calculateBudgetAction } from "@/actions/db/calculation-actions"
import BudgetSummary from "./_components/budget-summary"

/**
 * @function BudgetPage
 * Main server component for the /budget route.
 */
export default async function BudgetPage() {
  // 1. Check Clerk authentication
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  // 2. Call the server action to compute budget
  const { isSuccess, data, message } = await calculateBudgetAction(userId)
  if (!isSuccess || !data) {
    console.error("Failed to calculate budget:", message)
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Budget Summary Error</h1>
        <p className="text-red-500">Failed to load budget: {message}</p>
      </div>
    )
  }

  // 3. Render the result in a client component
  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Monthly Budget Summary</h1>
      <BudgetSummary
        grossIncome={data.grossIncome}
        vat={data.vat}
        irpfRate={data.irpfRate}
        incomeTax={data.incomeTax}
        totalProfessional={data.totalProfessional}
        totalPersonal={data.totalPersonal}
        netIncome={data.netIncome}
        projectedSavings={data.projectedSavings}
        savingsGoal={data.savingsGoal}
        difference={data.difference}
      />
    </div>
  )
}
