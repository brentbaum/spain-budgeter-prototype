/**
 * @file clients-actions.ts
 * @description
 * Provides server actions for creating, reading, updating, and deleting therapist clients
 * from the "clients" table. Each action ensures that records are filtered by userId for
 * proper authorization.
 *
 * Actions:
 *   - createClientAction
 *   - getClientsAction
 *   - updateClientAction
 *   - deleteClientAction
 *
 * Usage:
 *   1. Import any of these actions in your server components or pages:
 *        import { createClientAction } from "@/actions/db/clients-actions"
 *   2. Call them within a "use server" environment or in server code (e.g. pages, server actions).
 *
 * Requirements:
 *   - Drizzle ORM is configured in "@/db/db"
 *   - clientsTable is defined in "@/db/schema/clients-schema"
 *   - The user must be authenticated; pass userId from Clerk's auth or from the session.
 *
 * Security:
 *   - Each action requires a userId parameter for filtering.
 *
 * Dependencies:
 *   - "drizzle-orm" (eq)
 *   - "@/db/db" for the Drizzle instance
 *   - "@/db/schema/clients-schema" for the clientsTable reference
 *   - "@/types" for ActionState type
 *
 * @notes
 *   - If userId is invalid or not found, queries will return empty or fail gracefully.
 *   - Edge cases like negative sessionRate or monthlySessions are possible; handle them at the UI layer.
 */

"use server";

import { db } from "@/db/db";
import { clientsTable, type SelectClient } from "@/db/schema/clients-schema";
import { and, eq } from "drizzle-orm";
import type { ActionState } from "@/types";

/**
 * @interface CreateClientData
 * Represents the data required to create a client record.
 *
 * @property userId            - The ID of the authenticated user (from Clerk).
 * @property name              - Client's name.
 * @property monthlySessions   - Number of sessions per month with this client.
 * @property sessionRate       - Rate per session in currency units.
 */
interface CreateClientData {
	userId: string;
	name: string;
	monthlySessions: number;
	sessionRate: number;
}

/**
 * @function createClientAction
 * Creates a new client record in the database for the specified user.
 *
 * @param data  - The data needed to create a client (name, monthlySessions, sessionRate).
 * @returns     - A promise resolving to an ActionState containing the new client record on success.
 */
export async function createClientAction(data: CreateClientData) {
	try {
		const [newClient] = await db
			.insert(clientsTable)
			.values({
				userId: data.userId,
				name: data.name,
				monthlySessions: data.monthlySessions,
				sessionRate: data.sessionRate,
				updatedAt: new Date(),
			})
			.returning();
		return {
			isSuccess: true,
			message: "Client created successfully",
			data: newClient,
		};
	} catch (error) {
		console.error("Error creating client:", error);
		return {
			isSuccess: false,
			message: "Failed to create client",
		};
	}
}

/**
 * @function getClientsAction
 * Fetches all clients for a given user.
 *
 * @param userId  - The authenticated user ID.
 * @returns       - A promise resolving to an ActionState array of client records.
 */
export async function getClientsAction(
	userId: string,
): Promise<ActionState<SelectClient[]>> {
	try {
		const clients = await db
			.select()
			.from(clientsTable)
			.where(eq(clientsTable.userId, userId));

		return {
			isSuccess: true,
			message: "Clients retrieved successfully",
			data: clients,
		};
	} catch (error) {
		console.error("Error retrieving clients:", error);
		return {
			isSuccess: false,
			message: "Failed to retrieve clients",
		};
	}
}

/**
 * @interface UpdateClientData
 * Represents the fields that can be updated in a client record.
 *
 * @property name              - Updated client name (optional).
 * @property monthlySessions   - Updated number of sessions per month (optional).
 * @property sessionRate       - Updated session rate (optional).
 */
interface UpdateClientData {
	name?: string;
	monthlySessions?: number;
	sessionRate?: number;
}

/**
 * @function updateClientAction
 * Updates a client record for the given user.
 *
 * @param clientId - The ID of the client record to update.
 * @param userId   - The authenticated user ID.
 * @param data     - The partial client record data to update.
 * @returns        - A promise resolving to an ActionState with the updated record on success.
 */
export async function updateClientAction(
	clientId: string,
	userId: string,
	data: UpdateClientData,
): Promise<ActionState<SelectClient>> {
	try {
		const [updated] = await db
			.update(clientsTable)
			.set(data)
			.where(
				and(eq(clientsTable.id, clientId), eq(clientsTable.userId, userId)),
			)
			.returning();

		if (!updated) {
			return {
				isSuccess: false,
				message: "Client not found or update not applied.",
			};
		}

		return {
			isSuccess: true,
			message: "Client updated successfully",
			data: updated,
		};
	} catch (error) {
		console.error("Error updating client:", error);
		return {
			isSuccess: false,
			message: "Failed to update client",
		};
	}
}

/**
 * @function deleteClientAction
 * Deletes a client record for the given user.
 *
 * @param clientId - The ID of the client record to delete.
 * @param userId   - The authenticated user ID.
 * @returns        - A promise resolving to an ActionState with `data: undefined` on success.
 */
export async function deleteClientAction(
	clientId: string,
	userId: string,
): Promise<ActionState<void>> {
	try {
		const result = await db
			.delete(clientsTable)
			.where(
				and(eq(clientsTable.id, clientId), eq(clientsTable.userId, userId)),
			);

		if (result.length === 0) {
			return {
				isSuccess: false,
				message: "Client not found or already deleted",
			};
		}

		return {
			isSuccess: true,
			message: "Client deleted",
			data: undefined,
		};
	} catch (error) {
		console.error("Error deleting client:", error);
		return {
			isSuccess: false,
			message: "Failed to delete client",
		};
	}
}
