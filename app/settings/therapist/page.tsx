/**
 * @file page.tsx
 * @description
 *   This server page manages the therapist settings, such as the monthly
 *   savings goal. It fetches existing settings from getTherapistSettingsAction
 *   and displays them in a <TherapistSettingsForm> client component.
 *
 * Steps:
 *   1. Auth with Clerk to retrieve userId
 *   2. If no userId, redirect to /login
 *   3. getTherapistSettingsAction -> get or create row in DB
 *   4. Pass settings to the client form for changes
 *
 * @notes
 *   - This page is a "use server" component
 *   - The form itself is in a client component for user interactivity
 */

"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getTherapistSettingsAction } from "@/actions/db/therapist-settings-actions"
import TherapistSettingsForm from "./_components/therapist-settings-form"

/**
 * @function TherapistSettingsPage
 * Main server component for /settings/therapist.
 * Displays the monthly savings goal and allows updates.
 */
export default async function TherapistSettingsPage() {
  const { userId } = await auth()
  if (!userId) {
    return redirect("/login")
  }

  const {
    isSuccess,
    data: settings,
    message
  } = await getTherapistSettingsAction(userId)
  if (!isSuccess) {
    console.error("Failed to fetch therapist settings:", message)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Therapist Settings</h1>
      <TherapistSettingsForm userId={userId} initialSettings={settings} />
    </div>
  )
}
