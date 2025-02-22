/**
 * @file layout.tsx
 * @description
 *   This server layout is used by the /budget route. It wraps the budget page in a simple layout container.
 *
 * Key Points:
 *   - Must be a server component (using "use server" directive).
 *   - Accepts children as React.ReactNode.
 *   - Returns a <div> that can be styled or include shared UI (sidebar, header, etc.).
 *
 * @notes
 *   - Currently minimal; feel free to expand with additional styling or components.
 *   - If you prefer not to have a layout, you can omit this file, but the plan calls for route scoping with a layout.
 */

"use server"

interface BudgetLayoutProps {
  children: React.ReactNode
}

/**
 * @function BudgetLayout
 * A server layout that wraps the /budget route content.
 *
 * @param children - The nested page or route content
 * @returns A <div> container with potential for shared styling or components
 */
export default async function BudgetLayout({ children }: BudgetLayoutProps) {
  return <div className="bg-background min-h-screen">{children}</div>
}
