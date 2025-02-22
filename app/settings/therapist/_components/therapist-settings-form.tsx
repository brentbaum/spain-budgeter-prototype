/**
 * @file therapist-settings-form.tsx
 * @description
 *   This client component provides a simple form to view or update the
 *   monthly savings goal in the therapist settings.
 *
 * Steps:
 *   1. Display an input for monthlySavingsGoal
 *   2. On form submission, call setTherapistSettingsAction
 *   3. Optimistically update the local state
 *
 * @notes
 *   - Must use "use client" for interactivity and local state
 *   - We rely on the existing setTherapistSettingsAction in the server
 */

"use client"

import { useState } from "react"
import { setTherapistSettingsAction } from "@/actions/db/therapist-settings-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TherapistSettings {
  id: string
  userId: string
  monthlySavingsGoal: number
  createdAt?: string
  updatedAt?: string
}

interface TherapistSettingsFormProps {
  userId: string
  initialSettings?: TherapistSettings
}

/**
 * @function TherapistSettingsForm
 * Renders a form for updating monthlySavingsGoal
 *
 * @param userId             The current user's Clerk ID
 * @param initialSettings    The existing therapist settings record, if any
 */
export default function TherapistSettingsForm({
  userId,
  initialSettings
}: TherapistSettingsFormProps) {
  // The monthly savings goal, defaulting to 0 if not set
  const [monthlyGoal, setMonthlyGoal] = useState<number>(
    initialSettings?.monthlySavingsGoal || 0
  )

  /**
   * @function handleSaveSettings
   * Calls setTherapistSettingsAction to update or insert the monthly savings goal.
   */
  const handleSaveSettings = async () => {
    if (monthlyGoal < 0) {
      alert("Monthly savings goal cannot be negative.")
      return
    }

    const result = await setTherapistSettingsAction(userId, monthlyGoal)
    if (!result.isSuccess) {
      alert("Failed to save therapist settings: " + result.message)
    } else {
      alert("Therapist settings saved successfully!")
    }
  }

  return (
    <div className="bg-card max-w-md space-y-4 rounded-lg border p-4">
      <label className="block">
        <span className="mb-1 block font-semibold">Monthly Savings Goal</span>
        <Input
          type="number"
          value={monthlyGoal.toString()}
          onChange={e => setMonthlyGoal(Number(e.target.value))}
        />
      </label>

      <Button onClick={handleSaveSettings}>Save Settings</Button>
    </div>
  )
}
