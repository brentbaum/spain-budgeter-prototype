/**
 * @file index.ts
 * @description
 * Aggregates and exports all table schemas in the db/schema directory.
 * We previously had profiles-schema and todos-schema. Now we add:
 *   - clients-schema
 *   - personal-expenses-schema
 *   - professional-expenses-schema
 *   - therapist-settings-schema
 *
 * Exports:
 *  - from profiles-schema
 *  - from todos-schema
 *  - from clients-schema
 *  - from personal-expenses-schema
 *  - from professional-expenses-schema
 *  - from therapist-settings-schema
 */

export * from "./profiles-schema"
export * from "./todos-schema"
export * from "./clients-schema"
export * from "./personal-expenses-schema"
export * from "./professional-expenses-schema"
export * from "./therapist-settings-schema"
