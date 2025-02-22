/**
 * @file professional-expenses-actions.ts
 * @description Server actions for managing professional expenses in the database.
 *
 * These actions allow CRUD operations on the `professional_expenses` table:
 *  - createProfessionalExpenseAction: Create a new professional expense
 *  - getProfessionalExpensesAction: Get professional expenses for a user
 *  - updateProfessionalExpenseAction: Update a professional expense (by userId & expenseId)
 *  - deleteProfessionalExpenseAction: Delete a professional expense (by userId & expenseId)
 *
 * All actions enforce user-based filtering using userId to ensure user data isolation.
 *
 * @notes
 * - Edge cases:
 *   1. Negative cost is still allowed by this code, but we can add validation if needed.
 *   2. If no row found during update/delete, the action will simply do nothing or return an error response.
 * - The data returned from Drizzle is typed as 'any' for demonstration. For stricter typing, import relevant schema type.
 *
 * @dependencies
 *  - db from "@/db/db"
 *  - professionalExpensesTable from "@/db/schema/professional-expenses-schema"
 *  - eq from "drizzle-orm"
 *  - ActionState from "@/types"
 */

"use server";

import { db } from "@/db/db";
import {
	professionalExpensesTable,
	type SelectProfessionalExpense,
} from "@/db/schema/professional-expenses-schema";
import { and, eq } from "drizzle-orm";
import type { ActionState } from "@/types";

/**
 * createProfessionalExpenseAction
 * @param data An object containing userId, description, and cost
 * @returns ActionState with the newly created professional expense or failure
 */
export async function createProfessionalExpenseAction(data: {
	userId: string;
	description: string;
	cost: number;
}): Promise<ActionState<SelectProfessionalExpense>> {
	try {
		const [newExpense] = await db
			.insert(professionalExpensesTable)
			.values({
				userId: data.userId,
				description: data.description,
				cost: data.cost,
			})
			.returning();

		return {
			isSuccess: true,
			message: "Professional expense created successfully",
			data: newExpense,
		};
	} catch (error) {
		console.error("Error creating professional expense:", error);
		return {
			isSuccess: false,
			message: "Failed to create professional expense",
		};
	}
}

/**
 * getProfessionalExpensesAction
 * @param userId The user's ID
 * @returns ActionState with an array of professional expenses belonging to the user
 */
export async function getProfessionalExpensesAction(
	userId: string,
): Promise<ActionState<SelectProfessionalExpense[]>> {
	try {
		const expenses = await db
			.select()
			.from(professionalExpensesTable)
			.where(eq(professionalExpensesTable.userId, userId));

		return {
			isSuccess: true,
			message: "Professional expenses retrieved successfully",
			data: expenses,
		};
	} catch (error) {
		console.error("Error retrieving professional expenses:", error);
		return {
			isSuccess: false,
			message: "Failed to retrieve professional expenses",
		};
	}
}

/**
 * updateProfessionalExpenseAction
 * @param expenseId The professional expense ID
 * @param userId The user's ID for which the expense belongs
 * @param data The fields to update: description, cost
 * @returns ActionState containing the updated professional expense
 */
export async function updateProfessionalExpenseAction(
	expenseId: string,
	userId: string,
	data: {
		description?: string;
		cost?: number;
	},
): Promise<ActionState<SelectProfessionalExpense>> {
	try {
		const [updatedExpense] = await db
			.update(professionalExpensesTable)
			.set(data)
			.where(
				and(
					eq(professionalExpensesTable.id, expenseId),
					eq(professionalExpensesTable.userId, userId),
				),
			)
			.returning();

		if (!updatedExpense) {
			return { isSuccess: false, message: "Professional expense not found" };
		}

		return {
			isSuccess: true,
			message: "Professional expense updated",
			data: updatedExpense,
		};
	} catch (error) {
		console.error("Error updating professional expense:", error);
		return {
			isSuccess: false,
			message: "Failed to update professional expense",
		};
	}
}

/**
 * deleteProfessionalExpenseAction
 * @param expenseId The professional expense ID
 * @param userId The user's ID for which the expense belongs
 * @returns ActionState<void> with success/failure
 */
export async function deleteProfessionalExpenseAction(
	expenseId: string,
	userId: string,
): Promise<ActionState<void>> {
	try {
		await db
			.delete(professionalExpensesTable)
			.where(
				and(
					eq(professionalExpensesTable.id, expenseId),
					eq(professionalExpensesTable.userId, userId),
				),
			);

		return {
			isSuccess: true,
			message: "Professional expense deleted successfully",
			data: undefined,
		};
	} catch (error) {
		console.error("Error deleting professional expense:", error);
		return {
			isSuccess: false,
			message: "Failed to delete professional expense",
		};
	}
}
