/**
 * @file page.tsx
 * @description
 *   This server page fetches the user's professional expenses and displays them.
 *   It uses the getProfessionalExpensesAction to retrieve them, then renders
 *   <ProfessionalExpensesList> for the create/update/delete UI.
 *
 * @notes
 *   - Must be "use server"
 *   - If no user is signed in, redirect to /login.
 */

"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfessionalExpensesAction } from "@/actions/db/professional-expenses-actions"
import ProfessionalExpensesList from "./_components/professional-expenses-list"

/**
 * @function ProfessionalExpensesPage
 * Main server component for /professional-expenses
 */
export default async function ProfessionalExpensesPage() {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/login")
  }

  const {
    isSuccess,
    data: expenses,
    message
  } = await getProfessionalExpensesAction(userId)

  if (!isSuccess || !expenses) {
    console.error("Failed to fetch professional expenses:", message)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Professional Expenses</h1>
      <ProfessionalExpensesList
        userId={userId}
        initialExpenses={expenses || []}
      />
    </div>
  )
}
