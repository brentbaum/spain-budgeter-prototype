/**
 * @file layout.tsx
 * @description
 *   This server layout for /professional-expenses provides basic structure
 *   for the route. It currently just renders its children within a wrapper.
 *
 * @notes
 *   - Must use "use server" to be recognized as a server component.
 *   - You can extend it to add navigation or other shared UI.
 */

"use server"

interface ProfessionalExpensesLayoutProps {
  children: React.ReactNode
}

/**
 * @function ProfessionalExpensesLayout
 * Renders the professional expenses page with optional layout styling.
 *
 * @param children - The nested route content
 * @returns A React element wrapping the page content
 */
export default async function ProfessionalExpensesLayout({
  children
}: ProfessionalExpensesLayoutProps) {
  return <div className="bg-background min-h-screen w-full p-4">{children}</div>
}
