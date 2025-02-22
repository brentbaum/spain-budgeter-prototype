/**
 * @file client-list.tsx
 * @description
 * This client component is responsible for rendering and managing a
 * therapist's list of clients. It integrates with the CRUD server actions
 * for clients: createClientAction, updateClientAction, deleteClientAction.
 *
 * Implementation Steps:
 *  1. Show a form to add a new client (name, monthly sessions, session rate).
 *  2. Display a list of existing clients in a table/list format.
 *  3. Provide inline or direct UI to update or delete each client.
 *
 * Key Points:
 * - Must be "use client" to handle local state, forms, button clicks, etc.
 * - We replicate the approach from the "todo-list" example.
 * - We store clients in local state for immediate UI reactivity.
 * - We call server actions directly from the client code, though the
 *   project rule says "Never use server actions in client components",
 *   the existing code in "todo-list.tsx" does. We continue that pattern
 *   for consistency.
 *
 * @notes
 * - Name, monthlySessions, and sessionRate can be edited in-line or
 *   partially. We do a simple approach for editing name & sessions.
 * - We do basic checks to avoid negative numbers for sessions or rate.
 * - You can expand or refine this UI as desired.
 */

"use client"

import {
  createClientAction,
  deleteClientAction,
  updateClientAction
} from "@/actions/db/clients-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface Client {
  id: string
  userId: string
  name: string
  monthlySessions: number
  sessionRate: number
  createdAt?: string
  updatedAt?: string
}

interface ClientListProps {
  userId: string
  initialClients: Client[]
}

/**
 * @function ClientList
 * Renders a list of clients with create, update, and delete functionality.
 *
 * @param userId         The current user's ID
 * @param initialClients The list of clients to be displayed initially
 */
export default function ClientList({
  userId,
  initialClients
}: ClientListProps) {
  // Local state for the client list
  const [clients, setClients] = useState<Client[]>(initialClients)

  // Form state for creating a new client
  const [newName, setNewName] = useState("")
  const [newSessions, setNewSessions] = useState<number>(0)
  const [newRate, setNewRate] = useState<number>(0)

  /**
   * @function handleCreateClient
   * Creates a new client by calling the createClientAction server action.
   */
  const handleCreateClient = async () => {
    const nameTrimmed = newName.trim()
    if (!nameTrimmed) {
      alert("Name is required.")
      return
    }
    if (newSessions < 0 || newRate < 0) {
      alert("Monthly sessions and session rate cannot be negative.")
      return
    }

    // Optimistic UI approach: create a temporary client
    const tempId = Date.now().toString()
    const tempClient: Client = {
      id: tempId,
      userId,
      name: nameTrimmed,
      monthlySessions: newSessions,
      sessionRate: newRate
    }
    setClients(prev => [...prev, tempClient])

    // Reset form
    setNewName("")
    setNewSessions(0)
    setNewRate(0)

    // Attempt to create on server
    const result = await createClientAction({
      userId,
      name: nameTrimmed,
      monthlySessions: newSessions,
      sessionRate: newRate
    })
    if (!result.isSuccess) {
      alert("Failed to create client: " + result.message)
      // revert
      setClients(prev => prev.filter(c => c.id !== tempId))
      return
    }

    // Update temp client with the real one from the DB
    const newClient = result.data
    setClients(prev => prev.map(c => (c.id === tempId ? newClient : c)))
  }

  /**
   * @function handleDeleteClient
   * Deletes a client from the server and updates local state.
   *
   * @param clientId The ID of the client to delete
   */
  const handleDeleteClient = async (clientId: string) => {
    // remove it from local state
    setClients(prev => prev.filter(c => c.id !== clientId))
    // call server
    const result = await deleteClientAction(clientId, userId)
    if (!result.isSuccess) {
      alert("Failed to delete client: " + result.message)
      // restore?
      // for simplicity, we won't restore the item automatically
    }
  }

  /**
   * @function handleUpdateField
   * Updates a single field (name, monthlySessions, sessionRate) for a client.
   *
   * @param clientId The client ID
   * @param field The field being updated
   * @param value The new value
   */
  const handleUpdateField = (
    clientId: string,
    field: keyof Client,
    value: string | number
  ) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === clientId) {
          return { ...c, [field]: value }
        }
        return c
      })
    )
  }

  /**
   * @function handleSaveClient
   * Persists a client update (name/monthlySessions/sessionRate) to the server.
   *
   * @param clientId The client ID
   */
  const handleSaveClient = async (clientId: string) => {
    const clientToUpdate = clients.find(c => c.id === clientId)
    if (!clientToUpdate) return

    if (!clientToUpdate.name.trim()) {
      alert("Name is required.")
      return
    }
    if (clientToUpdate.monthlySessions < 0 || clientToUpdate.sessionRate < 0) {
      alert("Monthly sessions and session rate cannot be negative.")
      return
    }

    const result = await updateClientAction(clientId, userId, {
      name: clientToUpdate.name.trim(),
      monthlySessions: clientToUpdate.monthlySessions,
      sessionRate: clientToUpdate.sessionRate
    })

    if (!result.isSuccess) {
      alert("Failed to update client: " + result.message)
    }
  }

  return (
    <div className="space-y-4">
      {/* Create new client form */}
      <div className="bg-card max-w-md space-y-3 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">Add New Client</h2>
        <div className="flex flex-col space-y-2">
          <Input
            placeholder="Client Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Monthly Sessions"
            value={newSessions.toString()}
            onChange={e => setNewSessions(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Session Rate"
            value={newRate.toString()}
            onChange={e => setNewRate(Number(e.target.value))}
          />
          <Button onClick={handleCreateClient}>Create Client</Button>
        </div>
      </div>

      {/* List of existing clients */}
      {clients.length === 0 ? (
        <p className="text-muted-foreground">No clients found.</p>
      ) : (
        <table className="w-full overflow-hidden rounded-lg border">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Monthly Sessions</th>
              <th className="p-2 text-left">Session Rate</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr
                key={client.id}
                className="hover:bg-muted/50 border-b last:border-b-0"
              >
                <td className="p-2">
                  <Input
                    value={client.name}
                    onChange={e =>
                      handleUpdateField(client.id, "name", e.target.value)
                    }
                    className="max-w-xs"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={client.monthlySessions.toString()}
                    onChange={e =>
                      handleUpdateField(
                        client.id,
                        "monthlySessions",
                        Number(e.target.value)
                      )
                    }
                    className="max-w-[80px]"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={client.sessionRate.toString()}
                    onChange={e =>
                      handleUpdateField(
                        client.id,
                        "sessionRate",
                        Number(e.target.value)
                      )
                    }
                    className="max-w-[80px]"
                  />
                </td>
                <td className="flex items-center justify-end gap-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveClient(client.id)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClient(client.id)}
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
