/**
 * @file personal-expenses-list.tsx
 * @description
 *   This client component manages a list of personal expenses. It uses
 *   createPersonalExpenseAction, updatePersonalExpenseAction, and
 *   deletePersonalExpenseAction to perform CRUD operations on the server.
 *
 * Steps:
 *   1. Show a form to add new personal expenses
 *   2. Display a table of existing expenses
 *   3. Allow updating description/cost in-line
 *   4. Handle deletion
 *
 * @notes
 *   - Similar approach to 'client-list.tsx'
 *   - We keep local state for immediate UI feedback (optimistic updates).
 *   - Must use "use client" to handle interactivity and local state.
 */

"use client"

import { useState } from "react"
import {
  createPersonalExpenseAction,
  updatePersonalExpenseAction,
  deletePersonalExpenseAction
} from "@/actions/db/personal-expenses-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SelectPersonalExpense } from "../../../db/schema"

interface PersonalExpensesListProps {
  userId: string
  initialExpenses: SelectPersonalExpense[]
}

/**
 * @function PersonalExpensesList
 * Renders and manages the list of personal expenses for the user,
 * enabling create, update, and delete operations.
 *
 * @param userId          The current user's Clerk ID
 * @param initialExpenses The initial array of personal expenses from the server
 */
export default function PersonalExpensesList({
  userId,
  initialExpenses
}: PersonalExpensesListProps) {
  // Keep local copy of expenses
  const [expenses, setExpenses] =
    useState<SelectPersonalExpense[]>(initialExpenses)

  // Form state for creating a new expense
  const [newDescription, setNewDescription] = useState("")
  const [newCost, setNewCost] = useState<number>(0)

  /**
   * @function handleCreateExpense
   * Creates a new personal expense via server action.
   */
  const handleCreateExpense = async () => {
    const desc = newDescription.trim()
    if (!desc) {
      alert("Description is required.")
      return
    }
    if (newCost < 0) {
      alert("Cost cannot be negative.")
      return
    }

    // Optimistic UI: add a temporary expense
    const tempId = Date.now().toString()
    const tempExpense: SelectPersonalExpense = {
      id: tempId,
      userId,
      description: desc,
      cost: newCost,
      createdAt: new Date(),
      updatedAt: null
    }

    setExpenses(prev => [...prev, tempExpense])
    setNewDescription("")
    setNewCost(0)

    const result = await createPersonalExpenseAction({
      userId,
      description: desc,
      cost: newCost
    })
    if (!result.isSuccess) {
      alert("Failed to create personal expense: " + result.message)
      // revert
      setExpenses(prev => prev.filter(e => e.id !== tempId))
      return
    }

    // Replace temp with the newly created record from DB
    const created = result.data!
    setExpenses(prev => prev.map(e => (e.id === tempId ? created : e)))
  }

  /**
   * @function handleUpdateField
   * Update a single field (description/cost) in local state.
   */
  const handleUpdateField = (
    expenseId: string,
    field: keyof SelectPersonalExpense,
    value: string | number
  ) => {
    setExpenses(prev =>
      prev.map(e => {
        if (e.id === expenseId) {
          return { ...e, [field]: value }
        }
        return e
      })
    )
  }

  /**
   * @function handleSaveExpense
   * Persists an expense update to the server.
   */
  const handleSaveExpense = async (expenseId: string) => {
    const expenseToUpdate = expenses.find(e => e.id === expenseId)
    if (!expenseToUpdate) return

    if (!expenseToUpdate.description.trim()) {
      alert("Description is required.")
      return
    }
    if (expenseToUpdate.cost < 0) {
      alert("Cost cannot be negative.")
      return
    }

    const result = await updatePersonalExpenseAction(expenseId, userId, {
      description: expenseToUpdate.description.trim(),
      cost: expenseToUpdate.cost
    })
    if (!result.isSuccess) {
      alert("Failed to update personal expense: " + result.message)
    }
  }

  /**
   * @function handleDeleteExpense
   * Deletes an expense from the server and updates local state.
   */
  const handleDeleteExpense = async (expenseId: string) => {
    // remove from local state
    setExpenses(prev => prev.filter(e => e.id !== expenseId))

    const result = await deletePersonalExpenseAction(expenseId, userId)
    if (!result.isSuccess) {
      alert("Failed to delete personal expense: " + result.message)
      // We won't revert for simplicity
    }
  }

  return (
    <div className="space-y-6">
      {/* Creation form */}
      <div className="bg-card max-w-md rounded-lg border p-4">
        <h2 className="mb-3 text-xl font-semibold">Add New Personal Expense</h2>
        <Input
          placeholder="Expense Description"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          className="mb-2"
        />
        <Input
          type="number"
          placeholder="Cost"
          value={newCost.toString()}
          onChange={e => setNewCost(Number(e.target.value))}
          className="mb-2"
        />
        <Button onClick={handleCreateExpense}>Add Expense</Button>
      </div>

      {/* Display existing expenses */}
      {expenses.length === 0 ? (
        <p className="text-muted-foreground">No personal expenses found.</p>
      ) : (
        <table className="w-full overflow-hidden rounded-lg border">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Cost</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr
                key={exp.id}
                className="hover:bg-muted/50 border-b last:border-b-0"
              >
                <td className="p-2">
                  <Input
                    value={exp.description}
                    onChange={e =>
                      handleUpdateField(exp.id, "description", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={exp.cost.toString()}
                    onChange={e =>
                      handleUpdateField(exp.id, "cost", Number(e.target.value))
                    }
                    className="max-w-[100px]"
                  />
                </td>
                <td className="flex items-center justify-end gap-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveExpense(exp.id)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteExpense(exp.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
