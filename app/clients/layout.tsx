/**
 * @file layout.tsx
 * @description
 * This server layout provides a placeholder layout for the /clients route.
 *
 * It follows the structure from the implementation plan that each route
 * can have its own layout. We simply return the children here, but you
 * could add a sidebar, breadcrumb, or other shared UI if desired.
 *
 * Key Points:
 * - Must be a server component
 * - Must accept React children
 * - Typically returns <div>{children}</div> or any specialized layout
 *
 * @notes
 * - The user must be authenticated in the page itself, not here
 * - We keep it minimal, but you may add Nav or Sidebar if you want
 */

"use server"

interface ClientsLayoutProps {
  children: React.ReactNode
}

/**
 * @function ClientsLayout
 * The default export that wraps the /clients route
 *
 * @param {React.ReactNode} children - The page content
 * @returns JSX element containing the route's layout
 */
export default async function ClientsLayout({ children }: ClientsLayoutProps) {
  return <div className="bg-background min-h-screen w-full">{children}</div>
}
