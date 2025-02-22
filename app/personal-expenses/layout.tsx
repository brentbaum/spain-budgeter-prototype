/**
 * @file layout.tsx
 * @description
 *   This server layout for /personal-expenses provides basic structure
 *   for the route. It currently just renders its children within a wrapper.
 *
 * @notes
 *   - You can add a sidebar, breadcrumb, or other shared UI if desired.
 *   - Must use "use server" to be recognized as a server component.
 */

"use server"

interface PersonalExpensesLayoutProps {
  children: React.ReactNode
}

/**
 * @function PersonalExpensesLayout
 * Renders the personal expenses page with optional layout styling.
 *
 * @param children - The nested route content
 * @returns A React element wrapping the page content
 */
export default async function PersonalExpensesLayout({
  children
}: PersonalExpensesLayoutProps) {
  return <div className="bg-background min-h-screen w-full p-4">{children}</div>
}
