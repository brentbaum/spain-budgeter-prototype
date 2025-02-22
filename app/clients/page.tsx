/**
 * @file page.tsx
 * @description
 * This server page fetches all therapist clients from the DB for the
 * authenticated user, then renders a <ClientList> client component to
 * handle the UI for displaying and modifying client data.
 *
 * Implementation Steps:
 *  1. We authenticate with Clerk (using auth).
 *  2. If not signed in, we redirect to /login.
 *  3. We call getClientsAction to retrieve the user's clients from the DB.
 *  4. We pass the clients to <ClientList> as initial props for rendering,
 *     editing, and deleting on the client side.
 *
 * Key Points:
 * - Must be "use server" at the top
 * - We use server actions at the server-level to fetch data
 * - We pass the data to the <ClientList> client component
 * - The plan specifically calls for a page to list and manage clients
 *
 * @notes
 * - We rely on the existing createClientAction, updateClientAction,
 *   and deleteClientAction calls from the client side (like in the todo-list example).
 */

"use server"

import { getClientsAction } from "@/actions/db/clients-actions"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ClientList from "./_components/client-list"

/**
 * @function ClientsPage
 * The main server page for the /clients route.
 * Fetches data from the server and passes it to a client component.
 */
export default async function ClientsPage() {
  // 1. Check user authentication
  const { userId } = await auth()
  if (!userId) {
    // If no user, redirect to login
    return redirect("/login")
  }

  // 2. Fetch all clients for this user
  const { isSuccess, data: clients, message } = await getClientsAction(userId)
  if (!isSuccess || !clients) {
    // If something goes wrong, you might handle the error differently
    // For now, let's just show an empty list
    console.error("Failed to fetch clients:", message)
  }

  // 3. Render the client list
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">My Clients</h1>
      <ClientList userId={userId} initialClients={clients || []} />
    </div>
  )
}
