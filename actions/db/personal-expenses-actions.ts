/**
 * @file personal-expenses-actions.ts
 * @description Server actions for managing personal expenses in the database.
 *
 * These actions allow CRUD operations on the `personal_expenses` table:
 *  - createPersonalExpenseAction: Create a new personal expense
 *  - getPersonalExpensesAction: Get personal expenses for a user
 *  - updatePersonalExpenseAction: Update a personal expense (by userId & expenseId)
 *  - deletePersonalExpenseAction: Delete a personal expense (by userId & expenseId)
 *
 * All actions enforce user-based filtering using userId to ensure user data isolation.
 *
 * @notes
 * - Edge cases:
 *   1. Negative cost is still allowed by this code, but we can add validation if needed.
 *   2. If no row found during update/delete, the action will simply do nothing or return an error response.
 * - The data returned from Drizzle is typed as 'any' below, but you may define a stricter type using the actual schema type if needed.
 *
 * @dependencies
 *  - db from "@/db/db"
 *  - personalExpensesTable from "@/db/schema/personal-expenses-schema"
 *  - eq from "drizzle-orm"
 *  - ActionState from "@/types"
 */

"use server";

import { db } from "@/db/db";
import {
	personalExpensesTable,
	type SelectPersonalExpense,
} from "@/db/schema/personal-expenses-schema";
import { and, eq } from "drizzle-orm";
import type { ActionState } from "@/types";

/**
 * createPersonalExpenseAction
 * @param data An object containing userId, description, and cost
 * @returns ActionState with newly created expense or failure
 *
 * This action inserts a new personal expense in the database for the specified user.
 */
export async function createPersonalExpenseAction(data: {
	userId: string;
	description: string;
	cost: number;
}): Promise<ActionState<SelectPersonalExpense>> {
	try {
		const [newExpense] = await db
			.insert(personalExpensesTable)
			.values({
				userId: data.userId,
				description: data.description,
				cost: data.cost,
			})
			.returning();

		return {
			isSuccess: true,
			message: "Personal expense created successfully",
			data: newExpense,
		};
	} catch (error) {
		console.error("Error creating personal expense:", error);
		return { isSuccess: false, message: "Failed to create personal expense" };
	}
}

/**
 * getPersonalExpensesAction
 * @param userId The user's ID
 * @returns ActionState with an array of personal expenses belonging to the user
 */
export async function getPersonalExpensesAction(
	userId: string,
): Promise<ActionState<SelectPersonalExpense[]>> {
	try {
		const expenses = await db
			.select()
			.from(personalExpensesTable)
			.where(eq(personalExpensesTable.userId, userId));

		return {
			isSuccess: true,
			message: "Personal expenses retrieved successfully",
			data: expenses,
		};
	} catch (error) {
		console.error("Error retrieving personal expenses:", error);
		return {
			isSuccess: false,
			message: "Failed to retrieve personal expenses",
		};
	}
}

/**
 * updatePersonalExpenseAction
 * @param expenseId The personal expense ID
 * @param userId The user's ID for which the expense belongs
 * @param data The fields to update: description, cost
 * @returns ActionState containing the updated personal expense
 */
export async function updatePersonalExpenseAction(
	expenseId: string,
	userId: string,
	data: {
		description?: string;
		cost?: number;
	},
): Promise<ActionState<SelectPersonalExpense>> {
	try {
		const [updatedExpense] = await db
			.update(personalExpensesTable)
			.set(data)
			.where(
				and(
					eq(personalExpensesTable.id, expenseId),
					eq(personalExpensesTable.userId, userId),
				),
			)
			.returning();

		if (!updatedExpense) {
			return { isSuccess: false, message: "Personal expense not found" };
		}

		return {
			isSuccess: true,
			message: "Personal expense updated",
			data: updatedExpense,
		};
	} catch (error) {
		console.error("Error updating personal expense:", error);
		return { isSuccess: false, message: "Failed to update personal expense" };
	}
}

/**
 * deletePersonalExpenseAction
 * @param expenseId The personal expense ID
 * @param userId The user's ID for which the expense belongs
 * @returns ActionState<void> with success/failure
 */
export async function deletePersonalExpenseAction(
	expenseId: string,
	userId: string,
): Promise<ActionState<void>> {
	try {
		await db
			.delete(personalExpensesTable)
			.where(
				and(
					eq(personalExpensesTable.id, expenseId),
					eq(personalExpensesTable.userId, userId),
				),
			);

		return {
			isSuccess: true,
			message: "Personal expense deleted successfully",
			data: undefined,
		};
	} catch (error) {
		console.error("Error deleting personal expense:", error);
		return { isSuccess: false, message: "Failed to delete personal expense" };
	}
}
