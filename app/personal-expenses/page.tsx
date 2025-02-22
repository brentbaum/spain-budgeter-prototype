/**
 * @file page.tsx
 * @description
 *   This server page fetches the user's personal expenses and displays them.
 *   It uses the getPersonalExpensesAction server action to retrieve expenses,
 *   and then renders <PersonalExpensesList> to handle the create/update/delete UI.
 *
 * @notes
 *   - Must be a server component. We do "use server" at the top.
 *   - Requires user auth (Clerk) to determine userId.
 *   - If no user is signed in, redirect to /login.
 */

"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getPersonalExpensesAction } from "@/actions/db/personal-expenses-actions"
import PersonalExpensesList from "./_components/personal-expenses-list"

/**
 * @function PersonalExpensesPage
 * Main server component for the /personal-expenses route.
 *
 * Steps:
 *   1. Retrieve userId from Clerk auth
 *   2. If no user, redirect to /login
 *   3. Use getPersonalExpensesAction to fetch personal expenses
 *   4. Render a client component <PersonalExpensesList> with the data
 */
export default async function PersonalExpensesPage() {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/login")
  }

  const {
    isSuccess,
    data: expenses,
    message
  } = await getPersonalExpensesAction(userId)

  if (!isSuccess || !expenses) {
    console.error("Failed to fetch personal expenses:", message)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Personal Expenses</h1>
      <PersonalExpensesList userId={userId} initialExpenses={expenses || []} />
    </div>
  )
}
