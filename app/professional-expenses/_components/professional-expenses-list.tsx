/**
 * @file professional-expenses-list.tsx
 * @description
 *   This client component manages a list of professional expenses. It relies on
 *   createProfessionalExpenseAction, updateProfessionalExpenseAction, and
 *   deleteProfessionalExpenseAction for server CRUD operations.
 *
 * Steps:
 *   1. Show a form to add new professional expenses
 *   2. Display a table of existing expenses
 *   3. Allow updating in-line
 *   4. Handle deletion
 *
 * @notes
 *   - Must use "use client" to manage local state and user interactions.
 */

"use client"

import { useState } from "react"
import {
  createProfessionalExpenseAction,
  updateProfessionalExpenseAction,
  deleteProfessionalExpenseAction
} from "@/actions/db/professional-expenses-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProfessionalExpense {
  id: string
  userId: string
  description: string
  cost: number
  createdAt?: string
  updatedAt?: string
}

interface ProfessionalExpensesListProps {
  userId: string
  initialExpenses: ProfessionalExpense[]
}

/**
 * @function ProfessionalExpensesList
 * Renders and manages the list of professional expenses, enabling
 * create, update, and delete operations via server actions.
 *
 * @param userId          The user's Clerk ID
 * @param initialExpenses An array of professional expenses from the server
 */
export default function ProfessionalExpensesList({
  userId,
  initialExpenses
}: ProfessionalExpensesListProps) {
  // Keep local array of expenses
  const [expenses, setExpenses] =
    useState<ProfessionalExpense[]>(initialExpenses)

  // Form state for new expense creation
  const [newDescription, setNewDescription] = useState("")
  const [newCost, setNewCost] = useState<number>(0)

  /**
   * @function handleCreateExpense
   * Creates a new professional expense via server action.
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

    const tempId = Date.now().toString()
    const tempExpense: ProfessionalExpense = {
      id: tempId,
      userId,
      description: desc,
      cost: newCost
    }

    setExpenses(prev => [...prev, tempExpense])
    setNewDescription("")
    setNewCost(0)

    const result = await createProfessionalExpenseAction({
      userId,
      description: desc,
      cost: newCost
    })
    if (!result.isSuccess) {
      alert("Failed to create professional expense: " + result.message)
      setExpenses(prev => prev.filter(e => e.id !== tempId))
      return
    }

    // replace temp with actual data from DB
    const created = result.data
    setExpenses(prev => prev.map(e => (e.id === tempId ? created : e)))
  }

  /**
   * @function handleUpdateField
   * Update a single field (description/cost) in local state
   */
  const handleUpdateField = (
    expenseId: string,
    field: keyof ProfessionalExpense,
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
   * Persists updated data to the server
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

    const result = await updateProfessionalExpenseAction(expenseId, userId, {
      description: expenseToUpdate.description.trim(),
      cost: expenseToUpdate.cost
    })
    if (!result.isSuccess) {
      alert("Failed to update professional expense: " + result.message)
    }
  }

  /**
   * @function handleDeleteExpense
   * Deletes a professional expense from the server
   */
  const handleDeleteExpense = async (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId))

    const result = await deleteProfessionalExpenseAction(expenseId, userId)
    if (!result.isSuccess) {
      alert("Failed to delete professional expense: " + result.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Creation form */}
      <div className="bg-card max-w-md rounded-lg border p-4">
        <h2 className="mb-3 text-xl font-semibold">
          Add New Professional Expense
        </h2>
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

      {/* Existing expenses table */}
      {expenses.length === 0 ? (
        <p className="text-muted-foreground">No professional expenses found.</p>
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
