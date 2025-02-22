You are an AI code generator responsible for implementing a web application based on a provided technical specification and implementation plan.

Your task is to systematically implement each step of the plan, one at a time.

First, carefully review the following inputs:

<project_request>
I'm creating a budget app for therapists in barcelona. It should have number of clients, number of session/month/client, session rate, a table to list personal expenses, a table to list professional expenses, a net income section with tax calculation (based on subtracting professional expenses, total current savings, and savings goals (in 6 months). 


This is in spain, so update the tax settings with VAT of 21% (calculated per-session) and add a vat paid per month section. Calculate tax rate based off the autonomo structure:

YOUR GLOBAL TAX RATE
The variable rates applicable to the taxable amount resulting from all your personal and business matters (after allowances and deductions are computed) can be seen in the tables below.
Income Tax in Spain varies slightly from one autonomous region to the other. The table is a pretty good approximation.
 
IRPF (Personal Income Tax) Scale
Taxable Base (up to)TaxRest ( up to)Tax Rate0,00 €012450.00 €19%12450 €2365.50€20200.00 €24%20200.00 €4225.50€35200.00 €30,00%35200.00 €8725.50€60000.00 €37,00%60000.00 €17901.50€45,00%

At the bottom of the page, you should have:
1. Calculate monthly gross income
2. Calculate professional expenses
3. Calculate monthly tax rate
4. Calculate monthly income tax
5. Calculate monthly vat
6. Calculate monthly personal expenses
7. Calculate net income = gross income minus professional expenses, monthly income tax,  monthly vat , and monthly personal expenses
8. Calculate how much above or below the target savings we'll be in 6 months based on all that
</project_request>

<project_rules>
# Project Instructions

Use specification and guidelines as you build the app.

Write the complete code for every step. Do not get lazy.

Your goal is to completely finish whatever I ask for.

You will see <ai_context> tags in the code. These are context tags that you should use to help you understand the codebase.

## Overview

This is a web app template.

## Tech Stack

- Frontend: Next.js, Tailwind, Shadcn, Framer Motion
- Backend: Postgres, Vercel Postgres, Drizzle ORM, Server Actions
- Auth: Clerk
- Payments: Stripe
- Analytics: PostHog
- Deployment: Vercel

## Project Structure

- `actions` - Server actions
  - `db` - Database related actions
  - Other actions
- `app` - Next.js app router
  - `api` - API routes
  - `route` - An example route
    - `_components` - One-off components for the route
    - `layout.tsx` - Layout for the route
    - `page.tsx` - Page for the route
- `components` - Shared components
  - `ui` - UI components
  - `utilities` - Utility components
- `db` - Database
  - `schema` - Database schemas
- `lib` - Library code
  - `hooks` - Custom hooks
- `prompts` - Prompt files
- `public` - Static assets
- `types` - Type definitions

## Rules

Follow these rules when building the app.

### General Rules

- Use `@` to import anything from the app unless otherwise specified
- Use kebab case for all files and folders unless otherwise specified
- Don't update shadcn components unless otherwise specified

#### Env Rules

- If you update environment variables, update the `.env.example` file
- All environment variables should go in `.env.local`
- Do not expose environment variables to the frontend
- Use `NEXT_PUBLIC_` prefix for environment variables that need to be accessed from the frontend
- You may import environment variables in server actions and components by using `process.env.VARIABLE_NAME`

#### Type Rules

Follow these rules when working with types.

- When importing types, use `@/types`
- Name files like `example-types.ts`
- All types should go in `types`
- Make sure to export the types in `types/index.ts`
- Prefer interfaces over type aliases
- If referring to db types, use `@/db/schema` such as `SelectTodo` from `todos-schema.ts`

An example of a type:

`types/actions-types.ts`

```ts
export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }
```

And exporting it:

`types/index.ts`

```ts
export * from "./actions-types"
```

### Frontend Rules

Follow these rules when working on the frontend.

It uses Next.js, Tailwind, Shadcn, and Framer Motion.

#### General Rules

- Use `lucide-react` for icons
- useSidebar must be used within a SidebarProvider

#### Components

- Use divs instead of other html tags unless otherwise specified
- Separate the main parts of a component's html with an extra blank line for visual spacing
- Always tag a component with either `use server` or `use client` at the top, including layouts and pages

##### Organization

- All components be named using kebab case like `example-component.tsx` unless otherwise specified
- Put components in `/_components` in the route if one-off components
- Put components in `/components` from the root if shared components

##### Data Fetching

- Fetch data in server components and pass the data down as props to client components.
- Use server actions from `/actions` to mutate data.

##### Server Components

- Use `"use server"` at the top of the file.
- Implement Suspense for asynchronous data fetching to show loading states while data is being fetched.
- If no asynchronous logic is required for a given server component, you do not need to wrap the component in `<Suspense>`. You can simply return the final UI directly since there is no async boundary needed.
- If asynchronous fetching is required, you can use a `<Suspense>` boundary and a fallback to indicate a loading state while data is loading.
- Server components cannot be imported into client components. If you want to use a server component in a client component, you must pass the as props using the "children" prop
- params in server pages should be awaited such as `const { courseId } = await params` where the type is `params: Promise<{ courseId: string }>`

Example of a server layout:

```tsx
"use server"

export default async function ExampleServerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
```

Example of a server page (with async logic):

```tsx
"use server"

import { Suspense } from "react"
import { SomeAction } from "@/actions/some-actions"
import SomeComponent from "./_components/some-component"
import SomeSkeleton from "./_components/some-skeleton"

export default async function ExampleServerPage() {
  return (
    <Suspense fallback={<SomeSkeleton className="some-class" />}>
      <SomeComponentFetcher />
    </Suspense>
  )
}

async function SomeComponentFetcher() {
  const { data } = await SomeAction()
  return <SomeComponent className="some-class" initialData={data || []} />
}
```

Example of a server page (no async logic required):

```tsx
"use server"

import SomeClientComponent from "./_components/some-client-component"

// In this case, no asynchronous work is being done, so no Suspense or fallback is required.
export default async function ExampleServerPage() {
  return <SomeClientComponent initialData={[]} />
}
```

Example of a server component:

```tsx
"use server"

interface ExampleServerComponentProps {
  // Your props here
}

export async function ExampleServerComponent({
  props
}: ExampleServerComponentProps) {
  // Your code here
}
```

##### Client Components

- Use `"use client"` at the top of the file
- Client components can safely rely on props passed down from server components, or handle UI interactions without needing <Suspense> if there’s no async logic.
- Never use server actions in client components. If you need to create a new server action, create it in `/actions`

Example of a client page:

```tsx
"use client"

export default function ExampleClientPage() {
  // Your code here
}
```

Example of a client component:

```tsx
"use client"

interface ExampleClientComponentProps {
  initialData: any[]
}

export default function ExampleClientComponent({
  initialData
}: ExampleClientComponentProps) {
  // Client-side logic here
  return <div>{initialData.length} items</div>
}
```

### Backend Rules

Follow these rules when working on the backend.

It uses Postgres, Supabase, Drizzle ORM, and Server Actions.

#### General Rules

- Never generate migrations. You do not have to do anything in the `db/migrations` folder inluding migrations and metadata. Ignore it.

#### Organization

#### Schemas

- When importing schemas, use `@/db/schema`
- Name files like `example-schema.ts`
- All schemas should go in `db/schema`
- Make sure to export the schema in `db/schema/index.ts`
- Make sure to add the schema to the `schema` object in `db/db.ts`
- If using a userId, always use `userId: text("user_id").notNull()`
- Always include createdAt and updatedAt columns in all tables
- Make sure to cascade delete when necessary
- Use enums for columns that have a limited set of possible values such as:

```ts
import { pgEnum } from "drizzle-orm/pg-core"

export const membershipEnum = pgEnum("membership", ["free", "pro"])

membership: membershipEnum("membership").notNull().default("free")
```

Example of a schema:

`db/schema/todos-schema.ts`

```ts
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const todosTable = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertTodo = typeof todosTable.$inferInsert
export type SelectTodo = typeof todosTable.$inferSelect
```

And exporting it:

`db/schema/index.ts`

```ts
export * from "./todos-schema"
```

And adding it to the schema in `db/db.ts`:

`db/db.ts`

```ts
import { todosTable } from "@/db/schema"

const schema = {
  todos: todosTable
}
```

And a more complex schema:

```ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const chatsTable = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertChat = typeof chatsTable.$inferInsert
export type SelectChat = typeof chatsTable.$inferSelect
```

```ts
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { chatsTable } from "./chats-schema"

export const roleEnum = pgEnum("role", ["assistant", "user"])

export const messagesTable = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id")
    .references(() => chatsTable.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertMessage = typeof messagesTable.$inferInsert
export type SelectMessage = typeof messagesTable.$inferSelect
```

And exporting it:

`db/schema/index.ts`

```ts
export * from "./chats-schema"
export * from "./messages-schema"
```

And adding it to the schema in `db/db.ts`:

`db/db.ts`

```ts
import { chatsTable, messagesTable } from "@/db/schema"

const schema = {
  chats: chatsTable,
  messages: messagesTable
}
```

#### Server Actions

- When importing actions, use `@/actions` or `@/actions/db` if db related
- DB related actions should go in the `actions/db` folder
- Other actions should go in the `actions` folder
- Name files like `example-actions.ts`
- All actions should go in the `actions` folder
- Only write the needed actions
- Return an ActionState with the needed data type from actions
- Include Action at the end of function names `Ex: exampleFunction -> exampleFunctionAction`
- Actions should return a Promise<ActionState<T>>
- Sort in CRUD order: Create, Read, Update, Delete
- Make sure to return undefined as the data type if the action is not supposed to return any data
- **Date Handling:** For columns defined as `PgDateString` (or any date string type), always convert JavaScript `Date` objects to ISO strings using `.toISOString()` before performing operations (e.g., comparisons or insertions). This ensures value type consistency and prevents type errors.

```ts
export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }
```

Example of an action:

`actions/db/todos-actions.ts`

```ts
"use server"

import { db } from "@/db/db"
import { InsertTodo, SelectTodo, todosTable } from "@/db/schema/todos-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createTodoAction(
  todo: InsertTodo
): Promise<ActionState<SelectTodo>> {
  try {
    const [newTodo] = await db.insert(todosTable).values(todo).returning()
    return {
      isSuccess: true,
      message: "Todo created successfully",
      data: newTodo
    }
  } catch (error) {
    console.error("Error creating todo:", error)
    return { isSuccess: false, message: "Failed to create todo" }
  }
}

export async function getTodosAction(
  userId: string
): Promise<ActionState<SelectTodo[]>> {
  try {
    const todos = await db.query.todos.findMany({
      where: eq(todosTable.userId, userId)
    })
    return {
      isSuccess: true,
      message: "Todos retrieved successfully",
      data: todos
    }
  } catch (error) {
    console.error("Error getting todos:", error)
    return { isSuccess: false, message: "Failed to get todos" }
  }
}

export async function updateTodoAction(
  id: string,
  data: Partial<InsertTodo>
): Promise<ActionState<SelectTodo>> {
  try {
    const [updatedTodo] = await db
      .update(todosTable)
      .set(data)
      .where(eq(todosTable.id, id))
      .returning()

    return {
      isSuccess: true,
      message: "Todo updated successfully",
      data: updatedTodo
    }
  } catch (error) {
    console.error("Error updating todo:", error)
    return { isSuccess: false, message: "Failed to update todo" }
  }
}

export async function deleteTodoAction(id: string): Promise<ActionState<void>> {
  try {
    await db.delete(todosTable).where(eq(todosTable.id, id))
    return {
      isSuccess: true,
      message: "Todo deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting todo:", error)
    return { isSuccess: false, message: "Failed to delete todo" }
  }
}
```

### Auth Rules

Follow these rules when working on auth.

It uses Clerk for authentication.

#### General Rules

- Import the auth helper with `import { auth } from "@clerk/nextjs/server"` in server components
- await the auth helper in server actions

### Payments Rules

Follow these rules when working on payments.

It uses Stripe for payments.

### Analytics Rules

Follow these rules when working on analytics.

It uses PostHog for analytics.

# Storage Rules

Follow these rules when working with Supabase Storage.

It uses Supabase Storage for file uploads, downloads, and management.

## General Rules

- Always use environment variables for bucket names to maintain consistency across environments
- Never hardcode bucket names in the application code
- Always handle file size limits and allowed file types at the application level
- Use the `upsert` method instead of `upload` when you want to replace existing files
- Always implement proper error handling for storage operations
- Use content-type headers when uploading files to ensure proper file handling

## Organization

### Buckets

- Name buckets in kebab-case: `user-uploads`, `profile-images`
- Create separate buckets for different types of files (e.g., `profile-images`, `documents`, `attachments`)
- Document bucket purposes in a central location
- Set appropriate bucket policies (public/private) based on access requirements
- Implement RLS (Row Level Security) policies for buckets that need user-specific access
- Make sure to let me know instructions for setting up RLS policies on Supabase since you can't do this yourself, including the SQL scripts I need to run in the editor

### File Structure

- Organize files in folders based on their purpose and ownership
- Use predictable, collision-resistant naming patterns
- Structure: `{bucket}/{userId}/{purpose}/{filename}`
- Example: `profile-images/123e4567-e89b/avatar/profile.jpg`
- Include timestamps in filenames when version history is important
- Example: `documents/123e4567-e89b/contracts/2024-02-13-contract.pdf`

## Actions

- When importing storage actions, use `@/actions/storage`
- Name files like `example-storage-actions.ts`
- Include Storage at the end of function names `Ex: uploadFile -> uploadFileStorage`
- Follow the same ActionState pattern as DB actions

Example of a storage action:

```ts
"use server"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ActionState } from "@/types"

export async function uploadFileStorage(
  bucket: string,
  path: string,
  file: File
): Promise<ActionState<{ path: string }>> {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: false,
        contentType: file.type
      })

    if (error) throw error

    return {
      isSuccess: true,
      message: "File uploaded successfully",
      data: { path: data.path }
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { isSuccess: false, message: "Failed to upload file" }
  }
}
```

## File Handling

### Upload Rules

- Always validate file size before upload
- Implement file type validation using both extension and MIME type
- Generate unique filenames to prevent collisions
- Set appropriate content-type headers
- Handle existing files appropriately (error or upsert)

Example validation:

```ts
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

function validateFile(file: File): boolean {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds limit")
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("File type not allowed")
  }

  return true
}
```

### Download Rules

- Always handle missing files gracefully
- Implement proper error handling for failed downloads
- Use signed URLs for private files

### Delete Rules

- Implement soft deletes when appropriate
- Clean up related database records when deleting files
- Handle bulk deletions carefully
- Verify ownership before deletion
- Always delete all versions/transforms of a file

## Security

### Bucket Policies

- Make buckets private by default
- Only make buckets public when absolutely necessary
- Use RLS policies to restrict access to authorized users
- Example RLS policy:

```sql
CREATE POLICY "Users can only access their own files"
ON storage.objects
FOR ALL
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### Access Control

- Generate short-lived signed URLs for private files
- Implement proper CORS policies
- Use separate buckets for public and private files
- Never expose internal file paths
- Validate user permissions before any operation

## Error Handling

- Implement specific error types for common storage issues
- Always provide meaningful error messages
- Implement retry logic for transient failures
- Log storage errors separately for monitoring

## Optimization

- Implement progressive upload for large files
- Clean up temporary files and failed uploads
- Use batch operations when handling multiple files
</project_rules>

<technical_specification>
# Therapist Budget App Technical Specification

## 1. System Overview
This application helps therapists in Barcelona manage monthly budgeting. It calculates gross income (via number of therapy sessions × session rate), tracks personal and professional expenses, and computes both IRPF (income tax) and IVA (VAT) for monthly net income insights. It also estimates 6-month savings against a defined goal.

### Key Workflows
1. **User Authenticates** via Clerk.
2. **User Adds Clients**:
   - Name
   - Monthly Sessions
   - Session Rate
3. **User Adds Expenses**:
   - Personal expenses
   - Professional expenses
4. **System Calculates** monthly net income considering:
   - Gross Income
   - VAT @ 21%
   - IRPF brackets (annual approximation)
   - Personal & Professional Expenses
5. **System Compares** projected 6-month savings to user’s goal.

### System Architecture
- **Frontend**: Next.js 13 App Router with Tailwind, Shadcn UI, and some Framer Motion effects.
- **Backend**:
  - Vercel Postgres with Drizzle ORM.
  - Server actions for create/read/update/delete (CRUD) and calculations.
- **Auth**: Clerk for user sessions/IDs.
- **Analytics**: PostHog for usage tracking.
- **Deployment**: Vercel hosting.

## 2. Project Structure

. ├─ actions │ ├─ db │ │ ├─ clients-actions.ts │ │ ├─ personal-expenses-actions.ts │ │ ├─ professional-expenses-actions.ts │ │ ├─ therapist-settings-actions.ts │ │ └─ calculation-actions.ts │ └─ (other-actions).ts ├─ app │ ├─ api │ │ └─ (api routes if needed) │ ├─ dashboard │ │ ├─ _components │ │ │ ├─ dashboard.tsx │ │ │ └─ ... │ │ ├─ layout.tsx │ │ └─ page.tsx │ ├─ clients │ │ ├─ _components │ │ │ └─ client-list.tsx │ │ ├─ layout.tsx │ │ └─ page.tsx │ └─ ... ├─ components │ └─ ui │ └─ (Shadcn UI components) ├─ db │ ├─ schema │ │ ├─ clients-schema.ts │ │ ├─ personal-expenses-schema.ts │ │ ├─ professional-expenses-schema.ts │ │ └─ therapist-settings-schema.ts │ └─ db.ts ├─ lib │ ├─ hooks │ └─ ... ├─ types │ ├─ actions-types.ts │ └─ index.ts └─ ...

pgsql
Copy

## 3. Feature Specification

### 3.1 Clients
- **User Story**: “As a therapist, I want to track each client’s number of sessions per month and session rate so I can automatically calculate my gross monthly income.”
- **Implementation Steps**:
  1. Create table `clients` with `id`, `userId`, `name`, `monthlySessions`, `sessionRate`.
  2. Provide CRUD server actions (create, get, update, delete).
  3. UI in `app/clients/page.tsx` for listing/adding/editing clients.
- **Edge Cases**:
  - Negative or zero session rate.
  - Very large session rate or sessions count.

### 3.2 Personal Expenses
- **User Story**: “I want to record my personal expenses so I see how they affect my net income.”
- **Steps**:
  1. Create table `personal_expenses`.
  2. Provide CRUD actions in `actions/db/personal-expenses-actions.ts`.
  3. UI to add or remove personal expenses.
- **Edge Cases**:
  - Large expense values.
  - Empty or missing descriptions.

### 3.3 Professional Expenses
- **User Story**: “As a therapist, I have business expenses that reduce my taxable income, so I want to record them separately.”
- **Steps**:
  1. Create table `professional_expenses`.
  2. Provide CRUD actions in `actions/db/professional-expenses-actions.ts`.
  3. UI to add or remove professional expenses.
- **Edge Cases**:
  - Large amounts, repeated expenses.

### 3.4 Tax Calculation & Net Income
- **User Story**: “I want a clear monthly breakdown of how much I pay in VAT, how much IRPF is deducted, and see final net income.”
- **Steps**:
  1. Compute monthly gross: `sum of (sessionRate * monthlySessions) for all clients`.
  2. VAT = 21% of gross.
  3. IRPF bracket check using approximate annual gross = `gross * 12`.
  4. IRPF monthly portion = bracket % × monthly gross.
  5. Net Income = `grossIncome - professionalExpenses - monthlyTax - monthlyVAT - personalExpenses`.
- **Edge Cases**:
  - No clients or no sessions → zero taxes.

### 3.5 Savings Goal (6 months)
- **User Story**: “I need to know if I can meet my savings goal in 6 months based on my net monthly income.”
- **Steps**:
  1. Table: `therapist_settings` with user’s monthly (or 6-month) goal.
  2. Calculation = `netIncome * 6`.
  3. Compare to `goal`.
  4. Display difference.
- **Edge Cases**:
  - Goal set to zero or extremely high.

## 4. Database Schema

### 4.1 Tables

#### `clientsTable`
```ts
import { pgTable, text, integer, numeric, timestamp, uuid } from "drizzle-orm/pg-core"

export const clientsTable = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  monthlySessions: integer("monthly_sessions").default(0).notNull(),
  sessionRate: numeric("session_rate", 10, 2).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdateNow()
})
personalExpensesTable
ts
Copy
import { pgTable, text, numeric, timestamp, uuid } from "drizzle-orm/pg-core"

export const personalExpensesTable = pgTable("personal_expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  description: text("description").notNull(),
  cost: numeric("cost", 10, 2).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdateNow()
})
professionalExpensesTable
ts
Copy
import { pgTable, text, numeric, timestamp, uuid } from "drizzle-orm/pg-core"

export const professionalExpensesTable = pgTable("professional_expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  description: text("description").notNull(),
  cost: numeric("cost", 10, 2).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdateNow()
})
therapistSettingsTable
ts
Copy
import { pgTable, text, numeric, timestamp, uuid } from "drizzle-orm/pg-core"

export const therapistSettingsTable = pgTable("therapist_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  monthlySavingsGoal: numeric("monthly_savings_goal", 10, 2).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdateNow()
})
5. Server Actions
5.1 Database Actions
Clients
ts
Copy
"use server"
import { db } from "@/db/db"
import { clientsTable } from "@/db/schema/clients-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"

export async function createClientAction(data: {
  userId: string
  name: string
  monthlySessions: number
  sessionRate: number
}): Promise<ActionState<any>> {
  try {
    const [newClient] = await db.insert(clientsTable).values({
      userId: data.userId,
      name: data.name,
      monthlySessions: data.monthlySessions,
      sessionRate: data.sessionRate
    }).returning()
    return {
      isSuccess: true,
      message: "Client created successfully",
      data: newClient
    }
  } catch (error) {
    return { isSuccess: false, message: "Failed to create client" }
  }
}

export async function getClientsAction(userId: string): Promise<ActionState<any[]>> {
  try {
    const clients = await db.select().from(clientsTable).where(eq(clientsTable.userId, userId))
    return {
      isSuccess: true,
      message: "Clients retrieved successfully",
      data: clients
    }
  } catch (error) {
    return { isSuccess: false, message: "Failed to retrieve clients" }
  }
}

export async function updateClientAction(clientId: string, userId: string, data: {
  name?: string
  monthlySessions?: number
  sessionRate?: number
}): Promise<ActionState<any>> {
  try {
    const [updated] = await db
      .update(clientsTable)
      .set(data)
      .where(eq(clientsTable.id, clientId))
      .where(eq(clientsTable.userId, userId))
      .returning()
    return {
      isSuccess: true,
      message: "Client updated",
      data: updated
    }
  } catch (error) {
    return { isSuccess: false, message: "Failed to update client" }
  }
}

export async function deleteClientAction(clientId: string, userId: string): Promise<ActionState<void>> {
  try {
    await db
      .delete(clientsTable)
      .where(eq(clientsTable.id, clientId))
      .where(eq(clientsTable.userId, userId))
    return {
      isSuccess: true,
      message: "Client deleted",
      data: undefined
    }
  } catch (error) {
    return { isSuccess: false, message: "Failed to delete client" }
  }
}
(Repeat similar CRUD logic for Personal & Professional Expenses.)

Personal Expenses
ts
Copy
"use server"
import { db } from "@/db/db"
import { personalExpensesTable } from "@/db/schema/personal-expenses-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"

export async function createPersonalExpenseAction(data: {
  userId: string
  description: string
  cost: number
}): Promise<ActionState<any>> {
  try {
    const [newExpense] = await db.insert(personalExpensesTable).values({
      userId: data.userId,
      description: data.description,
      cost: data.cost
    }).returning()
    return {
      isSuccess: true,
      message: "Personal expense created",
      data: newExpense
    }
  } catch (error) {
    return { isSuccess: false, message: "Failed to create personal expense" }
  }
}

// ...get, update, delete with similar structure...
Professional Expenses
ts
Copy
"use server"
// Similar logic
Therapist Settings
ts
Copy
"use server"
import { db } from "@/db/db"
import { therapistSettingsTable } from "@/db/schema/therapist-settings-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"

export async function setTherapistSettingsAction(
  userId: string,
  monthlySavingsGoal: number
): Promise<ActionState<any>> {
  try {
    // Upsert-like approach: check if row exists, then update, else create
    const existing = await db.select().from(therapistSettingsTable).where(eq(therapistSettingsTable.userId, userId))
    let result
    if (existing.length > 0) {
      [result] = await db
        .update(therapistSettingsTable)
        .set({ monthlySavingsGoal })
        .where(eq(therapistSettingsTable.userId, userId))
        .returning()
    } else {
      [result] = await db
        .insert(therapistSettingsTable)
        .values({ userId, monthlySavingsGoal })
        .returning()
    }
    return {
      isSuccess: true,
      message: "Therapist settings updated",
      data: result
    }
  } catch (error) {
    return { isSuccess: false, message: "Failed to set therapist settings" }
  }
}

export async function getTherapistSettingsAction(
  userId: string
): Promise<ActionState<any>> {
  try {
    const [settings] = await db
      .select()
      .from(therapistSettingsTable)
      .where(eq(therapistSettingsTable.userId, userId))
    return {
      isSuccess: true,
      message: "Therapist settings fetched",
      data: settings
    }
  } catch (error) {
    return { isSuccess: false, message: "Failed to get therapist settings" }
  }
}
5.2 Other Actions
Calculation Action
ts
Copy
"use server"
import { db } from "@/db/db"
import { clientsTable } from "@/db/schema/clients-schema"
import { personalExpensesTable } from "@/db/schema/personal-expenses-schema"
import { professionalExpensesTable } from "@/db/schema/professional-expenses-schema"
import { therapistSettingsTable } from "@/db/schema/therapist-settings-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"

export async function calculateBudgetAction(userId: string): Promise<
  ActionState<{
    grossIncome: number
    vat: number
    irpfRate: number
    incomeTax: number
    totalProfessional: number
    totalPersonal: number
    netIncome: number
    projectedSavings: number
    savingsGoal: number
    difference: number
  }>
> {
  try {
    // 1. Get gross income from all clients
    const clients = await db.select().from(clientsTable).where(eq(clientsTable.userId, userId))
    const grossIncome = clients.reduce((acc, c) => {
      return acc + Number(c.monthlySessions) * Number(c.sessionRate)
    }, 0)

    // 2. Calculate VAT (21%)
    const vat = grossIncome * 0.21

    // 3. Determine IRPF bracket
    const annualIncome = grossIncome * 12
    let irpfRate = 0
    if (annualIncome <= 12450) {
      irpfRate = 0.19
    } else if (annualIncome <= 20200) {
      irpfRate = 0.24
    } else if (annualIncome <= 35200) {
      irpfRate = 0.30
    } else if (annualIncome <= 60000) {
      irpfRate = 0.37
    } else {
      irpfRate = 0.45
    }

    // 4. monthly income tax
    const incomeTax = grossIncome * irpfRate

    // 5. Sum professional & personal expenses
    const professionalExpenses = await db.select().from(professionalExpensesTable).where(eq(professionalExpensesTable.userId, userId))
    const totalProfessional = professionalExpenses.reduce((acc, e) => acc + Number(e.cost), 0)
    const personalExpenses = await db.select().from(personalExpensesTable).where(eq(personalExpensesTable.userId, userId))
    const totalPersonal = personalExpenses.reduce((acc, e) => acc + Number(e.cost), 0)

    // 6. Net income
    const netIncome = grossIncome - totalProfessional - incomeTax - vat - totalPersonal

    // 7. Get user settings (savings goal)
    const [settings] = await db.select().from(therapistSettingsTable).where(eq(therapistSettingsTable.userId, userId))
    const savingsGoal = settings?.monthlySavingsGoal
      ? Number(settings.monthlySavingsGoal) * 6
      : 0

    const projectedSavings = netIncome * 6
    const difference = projectedSavings - savingsGoal

    return {
      isSuccess: true,
      message: "Budget calculated successfully",
      data: {
        grossIncome,
        vat,
        irpfRate,
        incomeTax,
        totalProfessional,
        totalPersonal,
        netIncome,
        projectedSavings,
        savingsGoal,
        difference
      }
    }
  } catch (error) {
    return { isSuccess: false, message: "Failed to calculate budget" }
  }
}
6. Design System
6.1 Visual Style
Colors:
Primary: #1E90FF
Secondary: #FF6347
Accent: #FFD700
Background: #F8F9FA
Text: #222222
Typography:
Font: Inter, system-ui
Headings: 1.25rem to 2rem
Body: 1rem
Components: Shadcn UI for forms, buttons, etc.
Layout: Consistent spacing with Tailwind classes.
6.2 Core Components
Page Layout: Nav + main content area.
Form Components: Input, Select, Modal from Shadcn.
Cards/Panels: Reusable for data displays.
Interactive States:
Hover: Darken button background
Disabled: Lower opacity
7. Component Architecture
7.1 Server Components
Example: dashboard/page.tsx
"use server"
Fetch calculateBudgetAction(userId) data
<Suspense> fallback for loading
Pass results to a client component that displays summary
7.2 Client Components
Local State for forms, using useState.
Async Calls to server actions on button clicks.
Props:
Typically initialData: SomeType[].
For budget summary, initialData: BudgetSummaryType.
8. Authentication & Authorization
Clerk:
Import with import { auth } from "@clerk/nextjs/server".
const { userId } = await auth() in server actions or pages.
Authorization:
Ensure each DB query includes eq(table.userId, userId) to restrict data to the signed-in user.
9. Data Flow
Server:
Drizzle queries via server actions.
Client:
Renders results from server actions.
Initiates new server action calls on form submission.
10. Stripe Integration
Not strictly requested, but included per project rules.
Future potential for subscription or paid features:
Create a Checkout session for “Pro” subscription, handle webhook for subscription status.
11. PostHog Analytics
Implementation:
Initialize in Next.js layout (client side).
Capture events:
Page views
“Add Client,” “Add Expense,” “Calculate Budget”
Custom Properties:
userId (Clerk)
grossIncome, netIncome for aggregated analysis if desired (be mindful of privacy).
12. Testing
Unit Tests with Jest:
calculateBudgetAction.spec.ts: ensures bracket logic and sums are correct.
CRUD action tests: mock DB calls to check success/failure cases.
e2e Tests with Playwright:
Sign in with Clerk
Create a client
Add personal/professional expenses
Check final net income in the dashboard
Edge case: zero sessions, verify calculations
rust
Copy
  
This specification covers the core application architecture, database schema, server actions, UI structure, and testing approaches required for the Budget App for Therapists in Barcelona. Once implemented, it should address the project’s functional requirements and best practices for maintainability and extensibility.

</technical_specification>

<implementation_plan>
# Implementation Plan

## Database Schema
- [x] **Step 1: Add New Database Schemas for Budget App**
  - **Task**: 
    1. Create `clients-schema.ts`, `personal-expenses-schema.ts`, `professional-expenses-schema.ts`, and `therapist-settings-schema.ts` inside `db/schema/`.
    2. Export these from `db/schema/index.ts`.
    3. Add them to the schema object in `db/db.ts`.
  - **Files**:
    1. `db/schema/clients-schema.ts` (New)  
    2. `db/schema/personal-expenses-schema.ts` (New)  
    3. `db/schema/professional-expenses-schema.ts` (New)  
    4. `db/schema/therapist-settings-schema.ts` (New)  
    5. `db/schema/index.ts` (Existing)  
    6. `db/db.ts` (Existing)
  - **Step Dependencies**: None
  - **User Instructions**:
    - If needed, update `.env.local` with the correct `DATABASE_URL`.
    - After code generation, run any relevant Drizzle commands (e.g., `npm run db:generate` or `npm run db:migrate`) to update DB.


## Server Actions (CRUD)
- [x] **Step 2: Create Server Actions for Clients**
  - **Task**: 
    1. Create `clients-actions.ts` in `actions/db`.
    2. Implement create, get, update, delete actions for clients.
    3. Each action returns an `ActionState` with success/failure.
    4. Ensure `userId` is used in the where clauses for security.
  - **Files**:
    1. `actions/db/clients-actions.ts` (New)
  - **Step Dependencies**: Step 1
  - **User Instructions**: No additional instructions.

- [x] **Step 3: Create Server Actions for Personal & Professional Expenses for Therapist Settings****
  - **Task**:
    1. Implement similar CRUD actions for `personalExpensesTable` and `professionalExpensesTable` (two separate files).
    2. Each action uses `userId` checks.
    3. Implement upsert logic for `therapistSettingsTable`.
    4. Create `getTherapistSettingsAction` and `setTherapistSettingsAction`.
    5. Create `calculation-actions.ts` in `actions/db`.
    6. Inside, implement `calculateBudgetAction(userId: string)` to:
       - Sum up monthly gross from clients.
       - Calculate VAT @ 21%.
       - Approx IRPF bracket based on annual gross → monthly IRPF.
       - Sum personal and professional expenses.
       - Determine net monthly income.
       - Compare 6-month net total vs. user’s 6-month goal from therapist settings.
    7. Return an `ActionState` with all data needed by the UI.
  - **Files**:
    1. `actions/db/personal-expenses-actions.ts` (New)
    2. `actions/db/professional-expenses-actions.ts` (New)
    3. `actions/db/therapist-settings-actions.ts` (New)
    4. `actions/db/calculation-actions.ts` (New)
  - **Step Dependencies**: Step 1
  - **User Instructions**: None

## Frontend: Clients UI
- [x] **Step 4: Add a “Clients” Page with CRUD UI**
  - **Task**:
    1. Create a new route folder: `app/clients`
    2. Add `layout.tsx` (server) and `page.tsx` (server) files.
    3. In `page.tsx`, fetch all clients for the signed-in user (via server actions). 
    4. Render a client-side component (e.g., `_components/client-list.tsx`) to list existing clients and create new ones.
    5. Integrate the `createClientAction`, `updateClientAction`, `deleteClientAction`.
  - **Files**:
    1. `app/clients/layout.tsx` (New, server)
    2. `app/clients/page.tsx` (New, server)
    3. `app/clients/_components/client-list.tsx` (New, client)
  - **Step Dependencies**: Steps 2, possibly Step 1
  - **User Instructions**:
    - Make sure to sign in as a user first (Clerk).

## Frontend: Personal & Professional Expenses UI
- [ ] **Step 5: Personal Expenses Page**
  - **Task**:
    1. Create `app/personal-expenses` folder with `layout.tsx`, `page.tsx`.
    2. `page.tsx`: server component → fetch user’s personal expenses → pass to a client list component.
    3. Provide form or table to create, edit, delete expenses using the actions from Step 3.
    4. Same approach: `app/professional-expenses/layout.tsx`, `page.tsx`.
    5. Crud UI for professional expenses.
    6. Create a page, e.g., `app/settings/therapist` or `app/dashboard/settings`.
    7. Provide a form to set monthly savings goal. 
    8. Integrate `getTherapistSettingsAction` & `setTherapistSettingsAction`.
  - **Files**:
    1. `app/personal-expenses/layout.tsx` (New)
    2. `app/personal-expenses/page.tsx` (New)
    3. `app/personal-expenses/_components/personal-expenses-list.tsx` (New, client)
    5. `app/professional-expenses/layout.tsx` (New)
    6. `app/professional-expenses/page.tsx` (New)
    7. `app/professional-expenses/_components/professional-expenses-list.tsx` (New, client)
    8. `app/settings/therapist/page.tsx` (New, server)
    9. Possibly `_components/settings-form.tsx` (New, client)
  - **Step Dependencies**: Steps 1 & 3
  - **User Instructions**: None

- [ ] **Step 6: Main Dashboard (Net Income + 6-month Projection)**
  - **Task**:
    1. Create `app/dashboard/page.tsx` or `app/budget/page.tsx`.
    2. On load, call `calculateBudgetAction(userId)`.
    3. Show monthly gross, monthly IRPF, VAT, net income, projected 6-month savings, difference from goal, etc.
  - **Files**:
    1. `app/budget/page.tsx` (New, server or rename an existing route if desired)
    2. `app/budget/_components/budget-summary.tsx` (New, client)
  - **Step Dependencies**: Steps 5
  - **User Instructions**: None

## Testing
- [ ] **Step 7: Testing Strategy**
  - **Task**:
    1. Create unit tests for server actions (e.g., using Jest) to verify calculations and CRUD success/fail states.
    2. (Optional) Add an end-to-end test with Playwright or Cypress to simulate user flows: sign in, add clients, add expenses, check net income.
  - **Files**:
    - Potentially new test directories, e.g.:
      - `__tests__/actions/clients-actions.spec.ts`
      - `__tests__/actions/calculate-budget.spec.ts`
  - **Step Dependencies**: Steps 2-5
  - **User Instructions**:
    - `npm install --save-dev jest` or other testing libraries if needed.
    - Run tests locally.

## Summary & Wrap-up
- This plan walks through creating the new database tables, CRUD server actions, calculation logic, and user-facing pages to manage clients, personal/professional expenses, and settings. The final budget page queries aggregated data to display monthly net income and 6-month savings estimates. Once each step is implemented, tested, and integrated, we have a functional budgeting tool for therapists with IRPF and VAT calculations.

</implementation_plan>

<existing_code>
<file_map>
/Users/brentbaum/Downloads/mckays-app-template-main
├── .specstory
│   └── history
│       └── .what-is-this.md
├── actions
│   ├── db
│   │   ├── calculation-actions.ts
│   │   ├── clients-actions.ts
│   │   ├── personal-expenses-actions.ts
│   │   ├── professional-expenses-actions.ts
│   │   ├── profiles-actions.ts
│   │   ├── therapist-settings-actions.ts
│   │   └── todos-actions.ts
│   └── stripe-actions.ts
├── app
│   ├── (auth)
│   │   ├── login
│   │   │   └── [[...login]]
│   │   │       └── page.tsx
│   │   ├── signup
│   │   │   └── [[...signup]]
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── (marketing)
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── pricing
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api
│   │   └── stripe
│   │       └── webhooks
│   │           └── route.ts
│   ├── clients
│   │   ├── _components
│   │   │   └── client-list.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── todo
│   │   ├── _components
│   │   │   └── todo-list.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components
│   ├── landing
│   │   ├── features.tsx
│   │   └── hero.tsx
│   ├── magicui
│   │   ├── animated-gradient-text.tsx
│   │   └── hero-video-dialog.tsx
│   ├── sidebar
│   │   ├── app-sidebar.tsx
│   │   ├── nav-main.tsx
│   │   ├── nav-projects.tsx
│   │   ├── nav-user.tsx
│   │   └── team-switcher.tsx
│   ├── ui
│   ├── utilities
│   │   ├── posthog
│   │   │   ├── posthog-pageview.tsx
│   │   │   ├── posthog-provider.tsx
│   │   │   └── posthog-user-identity.tsx
│   │   ├── providers.tsx
│   │   ├── tailwind-indicator.tsx
│   │   └── theme-switcher.tsx
│   └── header.tsx
├── db
│   ├── schema
│   │   ├── clients-schema.ts
│   │   ├── index.ts
│   │   ├── personal-expenses-schema.ts
│   │   ├── professional-expenses-schema.ts
│   │   ├── profiles-schema.ts
│   │   ├── therapist-settings-schema.ts
│   │   └── todos-schema.ts
│   └── db.ts
├── hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib
│   ├── hooks
│   │   ├── use-copy-to-clipboard.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── stripe.ts
│   └── utils.ts
├── types
│   ├── index.ts
│   └── server-action-types.ts
├── .env
├── .env.example
├── .eslintrc.json
├── components.json
├── drizzle.config.ts
├── license
├── middleware.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── prettier.config.cjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

</file_map>

<file_contents>
File: actions/db/profiles-actions.ts
```ts
/*
<ai_context>
Contains server actions related to profiles in the DB.
</ai_context>
*/

"use server"

import { db } from "@/db/db"
import {
  InsertProfile,
  profilesTable,
  SelectProfile
} from "@/db/schema/profiles-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createProfileAction(
  data: InsertProfile
): Promise<ActionState<SelectProfile>> {
  try {
    const [newProfile] = await db.insert(profilesTable).values(data).returning()
    return {
      isSuccess: true,
      message: "Profile created successfully",
      data: newProfile
    }
  } catch (error) {
    console.error("Error creating profile:", error)
    return { isSuccess: false, message: "Failed to create profile" }
  }
}

export async function getProfileByUserIdAction(
  userId: string
): Promise<ActionState<SelectProfile>> {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId)
    })
    if (!profile) {
      return { isSuccess: false, message: "Profile not found" }
    }

    return {
      isSuccess: true,
      message: "Profile retrieved successfully",
      data: profile
    }
  } catch (error) {
    console.error("Error getting profile by user id", error)
    return { isSuccess: false, message: "Failed to get profile" }
  }
}

export async function updateProfileAction(
  userId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.userId, userId))
      .returning()

    if (!updatedProfile) {
      return { isSuccess: false, message: "Profile not found to update" }
    }

    return {
      isSuccess: true,
      message: "Profile updated successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { isSuccess: false, message: "Failed to update profile" }
  }
}

export async function updateProfileByStripeCustomerIdAction(
  stripeCustomerId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.stripeCustomerId, stripeCustomerId))
      .returning()

    if (!updatedProfile) {
      return {
        isSuccess: false,
        message: "Profile not found by Stripe customer ID"
      }
    }

    return {
      isSuccess: true,
      message: "Profile updated by Stripe customer ID successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating profile by stripe customer ID:", error)
    return {
      isSuccess: false,
      message: "Failed to update profile by Stripe customer ID"
    }
  }
}

export async function deleteProfileAction(
  userId: string
): Promise<ActionState<void>> {
  try {
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId))
    return {
      isSuccess: true,
      message: "Profile deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting profile:", error)
    return { isSuccess: false, message: "Failed to delete profile" }
  }
}

```

File: actions/db/todos-actions.ts
```ts
/*
<ai_context>
Contains server actions related to todos in the DB.
</ai_context>
*/

"use server"

import { db } from "@/db/db"
import { InsertTodo, SelectTodo, todosTable } from "@/db/schema/todos-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createTodoAction(
  todo: InsertTodo
): Promise<ActionState<SelectTodo>> {
  try {
    const [newTodo] = await db.insert(todosTable).values(todo).returning()
    return {
      isSuccess: true,
      message: "Todo created successfully",
      data: newTodo
    }
  } catch (error) {
    console.error("Error creating todo:", error)
    return { isSuccess: false, message: "Failed to create todo" }
  }
}

export async function getTodosAction(
  userId: string
): Promise<ActionState<SelectTodo[]>> {
  try {
    const todos = await db.query.todos.findMany({
      where: eq(todosTable.userId, userId)
    })
    return {
      isSuccess: true,
      message: "Todos retrieved successfully",
      data: todos
    }
  } catch (error) {
    console.error("Error getting todos:", error)
    return { isSuccess: false, message: "Failed to get todos" }
  }
}

export async function updateTodoAction(
  id: string,
  data: Partial<InsertTodo>
): Promise<ActionState<SelectTodo>> {
  try {
    const [updatedTodo] = await db
      .update(todosTable)
      .set(data)
      .where(eq(todosTable.id, id))
      .returning()

    return {
      isSuccess: true,
      message: "Todo updated successfully",
      data: updatedTodo
    }
  } catch (error) {
    console.error("Error updating todo:", error)
    return { isSuccess: false, message: "Failed to update todo" }
  }
}

export async function deleteTodoAction(id: string): Promise<ActionState<void>> {
  try {
    await db.delete(todosTable).where(eq(todosTable.id, id))
    return {
      isSuccess: true,
      message: "Todo deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting todo:", error)
    return { isSuccess: false, message: "Failed to delete todo" }
  }
}

```

File: actions/stripe-actions.ts
```ts
/*
<ai_context>
Contains server actions related to Stripe.
</ai_context>
*/

import {
  updateProfileAction,
  updateProfileByStripeCustomerIdAction
} from "@/actions/db/profiles-actions"
import { SelectProfile } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

type MembershipStatus = SelectProfile["membership"]

const getMembershipStatus = (
  status: Stripe.Subscription.Status,
  membership: MembershipStatus
): MembershipStatus => {
  switch (status) {
    case "active":
    case "trialing":
      return membership
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
    case "past_due":
    case "paused":
    case "unpaid":
      return "free"
    default:
      return "free"
  }
}

const getSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"]
  })
}

export const updateStripeCustomer = async (
  userId: string,
  subscriptionId: string,
  customerId: string
) => {
  try {
    if (!userId || !subscriptionId || !customerId) {
      throw new Error("Missing required parameters for updateStripeCustomer")
    }

    const subscription = await getSubscription(subscriptionId)

    const result = await updateProfileAction(userId, {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id
    })

    if (!result.isSuccess) {
      throw new Error("Failed to update customer profile")
    }

    return result.data
  } catch (error) {
    console.error("Error in updateStripeCustomer:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update Stripe customer")
  }
}

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  productId: string
): Promise<MembershipStatus> => {
  try {
    if (!subscriptionId || !customerId || !productId) {
      throw new Error(
        "Missing required parameters for manageSubscriptionStatusChange"
      )
    }

    const subscription = await getSubscription(subscriptionId)
    const product = await stripe.products.retrieve(productId)
    const membership = product.metadata.membership as MembershipStatus

    if (!["free", "pro"].includes(membership)) {
      throw new Error(
        `Invalid membership type in product metadata: ${membership}`
      )
    }

    const membershipStatus = getMembershipStatus(
      subscription.status,
      membership
    )

    const updateResult = await updateProfileByStripeCustomerIdAction(
      customerId,
      {
        stripeSubscriptionId: subscription.id,
        membership: membershipStatus
      }
    )

    if (!updateResult.isSuccess) {
      throw new Error("Failed to update subscription status")
    }

    return membershipStatus
  } catch (error) {
    console.error("Error in manageSubscriptionStatusChange:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to update subscription status")
  }
}

```

File: app/(auth)/login/[[...login]]/page.tsx
```tsx
/*
<ai_context>
This client page provides the login form from Clerk.
</ai_context>
*/

"use client"

import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export default function LoginPage() {
  const { theme } = useTheme()

  return (
    <SignIn
      forceRedirectUrl="/todo"
      appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
    />
  )
}

```

File: app/(auth)/signup/[[...signup]]/page.tsx
```tsx
/*
<ai_context>
This client page provides the signup form from Clerk.
</ai_context>
*/

"use client"

import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export default function SignUpPage() {
  const { theme } = useTheme()

  return (
    <SignUp
      forceRedirectUrl="/todo"
      appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
    />
  )
}

```

File: app/(auth)/layout.tsx
```tsx
/*
<ai_context>
This server layout provides a centered layout for (auth) pages.
</ai_context>
*/

"use server"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center">{children}</div>
  )
}

```

File: app/(marketing)/about/page.tsx
```tsx
/*
<ai_context>
This server page returns a simple "About Page" component as a (marketing) route.
</ai_context>
*/

"use server"

export default async function AboutPage() {
  return <div>About Page</div>
}

```

File: app/(marketing)/contact/page.tsx
```tsx
/*
<ai_context>
This server page returns a simple "Contact Page" component as a (marketing) route.
</ai_context>
*/

"use server"

export default async function ContactPage() {
  return <div>Contact Page</div>
}

```

File: app/(marketing)/pricing/page.tsx
```tsx
/*
<ai_context>
This server page displays pricing options for the product, integrating Stripe payment links.
</ai_context>
*/

"use server"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"

export default async function PricingPage() {
  const { userId } = await auth()

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Choose Your Plan</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <PricingCard
          title="Monthly Plan"
          price="$10"
          description="Billed monthly"
          buttonText="Subscribe Monthly"
          buttonLink={
            process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY || "#"
          }
          userId={userId}
        />
        <PricingCard
          title="Yearly Plan"
          price="$100"
          description="Billed annually"
          buttonText="Subscribe Yearly"
          buttonLink={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY || "#"}
          userId={userId}
        />
      </div>
    </div>
  )
}

interface PricingCardProps {
  title: string
  price: string
  description: string
  buttonText: string
  buttonLink: string
  userId: string | null
}

function PricingCard({
  title,
  price,
  description,
  buttonText,
  buttonLink,
  userId
}: PricingCardProps) {
  const finalButtonLink = userId
    ? `${buttonLink}?client_reference_id=${userId}`
    : buttonLink

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex grow items-center justify-center">
        <p className="text-4xl font-bold">{price}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <a
            href={finalButtonLink}
            className={cn(
              "inline-flex items-center justify-center",
              finalButtonLink === "#" && "pointer-events-none opacity-50"
            )}
          >
            {buttonText}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

```

File: app/(marketing)/layout.tsx
```tsx
/*
<ai_context>
This server layout provides a shared header and basic structure for (marketing) routes.
</ai_context>
*/

"use server"

import Header from "@/components/header"

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1">{children}</div>
    </div>
  )
}

```

File: app/(marketing)/page.tsx
```tsx
/*
<ai_context>
This server page is the marketing homepage.
</ai_context>
*/

"use server"

import { FeaturesSection } from "@/components/landing/features"
import { HeroSection } from "@/components/landing/hero"

export default async function HomePage() {
  return (
    <div className="pb-20">
      <HeroSection />
      {/* social proof */}
      <FeaturesSection />
      {/* pricing */}
      {/* faq */}
      {/* blog */}
      {/* footer */}
    </div>
  )
}

```

File: app/api/stripe/webhooks/route.ts
```ts
/*
<ai_context>
This API route handles Stripe webhook events to manage subscription status changes and updates user profiles accordingly.
</ai_context>
*/

import {
  manageSubscriptionStatusChange,
  updateStripeCustomer
} from "@/actions/stripe-actions"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted"
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) {
      throw new Error("Webhook secret or signature missing")
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await handleSubscriptionChange(event)
          break

        case "checkout.session.completed":
          await handleCheckoutSession(event)
          break

        default:
          throw new Error("Unhandled relevant event!")
      }
    } catch (error) {
      console.error("Webhook handler failed:", error)
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400
        }
      )
    }
  }

  return new Response(JSON.stringify({ received: true }))
}

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const productId = subscription.items.data[0].price.product as string
  await manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    productId
  )
}

async function handleCheckoutSession(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  if (checkoutSession.mode === "subscription") {
    const subscriptionId = checkoutSession.subscription as string
    await updateStripeCustomer(
      checkoutSession.client_reference_id as string,
      subscriptionId,
      checkoutSession.customer as string
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"]
    })

    const productId = subscription.items.data[0].price.product as string
    await manageSubscriptionStatusChange(
      subscription.id,
      subscription.customer as string,
      productId
    )
  }
}

```

File: app/todo/_components/todo-list.tsx
```tsx
/*
<ai_context>
This client component renders a Todo list with add, toggle, and delete functionality.
</ai_context>
*/

"use client"

import {
  createTodoAction,
  deleteTodoAction,
  updateTodoAction
} from "@/actions/db/todos-actions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { SelectTodo } from "@/db/schema"
import { Trash2 } from "lucide-react"
import { useState } from "react"

interface TodoListProps {
  userId: string
  initialTodos: SelectTodo[]
}

export function TodoList({ userId, initialTodos }: TodoListProps) {
  const [newTodo, setNewTodo] = useState("")
  const [todos, setTodos] = useState(initialTodos)

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      const newTodoData = {
        id: Date.now().toString(),
        userId,
        content: newTodo,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setTodos(prevTodos => [...prevTodos, newTodoData])
      setNewTodo("")

      const result = await createTodoAction({
        userId: userId,
        content: newTodo,
        completed: false
      })
      if (result.isSuccess) {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === newTodoData.id ? result.data : todo
          )
        )
      } else {
        console.error("Error creating todo:", result.message)
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== newTodoData.id)
        )
      }
    }
  }

  const handleToggleTodo = async (id: string, completed: boolean) => {
    console.log("handleToggleTodo", id, completed)
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    )

    await updateTodoAction(id, { completed: !completed })
  }

  const handleRemoveTodo = async (id: string) => {
    console.log("handleRemoveTodo", id)
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))

    await deleteTodoAction(id)
  }

  return (
    <div className="bg-card mx-auto mt-8 max-w-md rounded-lg p-6 shadow">
      <h1 className="mb-4 text-center text-2xl font-bold">Todo App</h1>

      <div className="mb-4 flex">
        <Input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="mr-2"
          onKeyPress={e => e.key === "Enter" && handleAddTodo()}
        />
        <Button onClick={handleAddTodo}>Add</Button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="bg-muted flex items-center justify-between rounded p-2"
          >
            <div className="flex items-center">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() =>
                  handleToggleTodo(todo.id, todo.completed)
                }
                className="mr-2"
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`${todo.completed ? "text-muted-foreground line-through" : ""}`}
              >
                {todo.content}
              </label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTodo(todo.id)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete todo</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

```

File: app/todo/layout.tsx
```tsx
/*
<ai_context>
This server layout provides a sidebar and breadcrumb navigation for the todo route. It wraps the todo page and its children.
</ai_context>
*/

"use server"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"

export default async function TodoLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Todos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

```

File: app/todo/page.tsx
```tsx
/*
<ai_context>
This server page retrieves user todos from the database and renders them in a list.
</ai_context>
*/

"use server"

import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { getTodosAction } from "@/actions/db/todos-actions"
import { TodoList } from "@/app/todo/_components/todo-list"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function TodoPage() {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/login")
  }

  const { data: profile } = await getProfileByUserIdAction(userId)

  if (!profile) {
    return redirect("/signup")
  }

  if (profile.membership === "free") {
    return redirect("/pricing")
  }

  const todos = await getTodosAction(userId)

  return (
    <div className="flex-1 p-4 pt-0">
      <TodoList userId={userId} initialTodos={todos.data ?? []} />
    </div>
  )
}

```

File: app/globals.css
```css
/*
<ai_context>
Global styles for the app.
</ai_context>
*/

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

```

File: app/layout.tsx
```tsx
/*
<ai_context>
The root server layout for the app.
</ai_context>
*/

import {
  createProfileAction,
  getProfileByUserIdAction
} from "@/actions/db/profiles-actions"
import { Toaster } from "@/components/ui/toaster"
import { PostHogPageview } from "@/components/utilities/posthog/posthog-pageview"
import { PostHogUserIdentify } from "@/components/utilities/posthog/posthog-user-identity"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mckay's App Template",
  description: "A full-stack web app template."
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (userId) {
    const profileRes = await getProfileByUserIdAction(userId)
    if (!profileRes.isSuccess) {
      await createProfileAction({ userId })
    }
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-background mx-auto min-h-screen w-full scroll-smooth antialiased",
            inter.className
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <PostHogUserIdentify />
            <PostHogPageview />

            {children}

            <TailwindIndicator />

            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}

```

File: components/landing/features.tsx
```tsx
/*
<ai_context>
This client component provides the features section for the landing page.
</ai_context>
*/

"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  AppWindow,
  Database,
  DollarSign,
  LucideIcon,
  Shield
} from "lucide-react"

interface FeatureProps {
  title: string
  description: string
  icon: LucideIcon
}

const features: FeatureProps[] = [
  {
    title: "Frontend",
    description: "Next.js, Tailwind, Shadcn, Framer Motion",
    icon: AppWindow
  },
  {
    title: "Backend",
    description: "Postgres, Supabase, Drizzle ORM, Server Actions",
    icon: Database
  },
  {
    title: "Auth",
    description: "Clerk",
    icon: Shield
  },
  {
    title: "Payments",
    description: "Stripe",
    icon: DollarSign
  }
]

const FeatureCard = ({ title, description, icon: Icon }: FeatureProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="transform-gpu"
  >
    <Card className="group transition-shadow duration-200 hover:shadow-lg">
      <CardHeader>
        <Icon className="text-primary mb-2 size-12" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
)

export const FeaturesSection = () => {
  return (
    <section className="mt-20 bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="mb-12 text-center text-4xl font-bold">Tech Stack</h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

```

File: components/landing/hero.tsx
```tsx
/*
<ai_context>
This client component provides the hero section for the landing page.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ChevronRight, Rocket } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"
import AnimatedGradientText from "../magicui/animated-gradient-text"
import HeroVideoDialog from "../magicui/hero-video-dialog"

export const HeroSection = () => {
  const handleGetStartedClick = () => {
    posthog.capture("clicked_get_started")
  }

  return (
    <div className="flex flex-col items-center justify-center px-8 pt-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <Link href="https://github.com/mckaywrigley/mckays-app-template">
          <AnimatedGradientText>
            🚀 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />
            <span
              className={cn(
                `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
              )}
            >
              View the code on GitHub
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="mt-8 flex max-w-2xl flex-col items-center justify-center gap-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-balance text-6xl font-bold"
        >
          Save time and start building.
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="max-w-xl text-balance text-xl"
        >
          Use Mckay's app template to save time and get started with your next
          project.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <Link
            href="https://github.com/mckaywrigley/mckays-app-template"
            onClick={handleGetStartedClick}
          >
            <Button className="bg-blue-500 text-lg hover:bg-blue-600">
              <Rocket className="mr-2 size-5" />
              Get Started &rarr;
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        className="mx-auto mt-20 flex w-full max-w-screen-lg items-center justify-center rounded-lg border shadow-lg"
      >
        <HeroVideoDialog
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/9yS0dR0kP-s"
          thumbnailSrc="hero.png"
          thumbnailAlt="Hero Video"
        />
      </motion.div>
    </div>
  )
}

```

File: components/magicui/animated-gradient-text.tsx
```tsx
/*
<ai_context>
This client component provides an animated gradient text.
</ai_context>
*/

import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export default function AnimatedGradientText({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40",
        className
      )}
    >
      <div
        className={`animate-gradient absolute inset-0 block size-full bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] p-[1px] [border-radius:inherit] ![mask-composite:subtract] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]`}
      />

      {children}
    </div>
  )
}

```

File: components/magicui/hero-video-dialog.tsx
```tsx
/*
<ai_context>
This client component provides a video dialog for the hero section.
</ai_context>
*/

"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Play, XIcon } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

interface HeroVideoProps {
  animationStyle?: AnimationStyle
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 }
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 }
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 }
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 }
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  }
}

export default function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const selectedAnimation = animationVariants[animationStyle]

  return (
    <div className={cn("relative", className)}>
      <div
        className="group relative cursor-pointer"
        onClick={() => setIsVideoOpen(true)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
        />
        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
          <div className="bg-primary/10 flex size-28 items-center justify-center rounded-full backdrop-blur-md">
            <div
              className={`from-primary/30 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}
            >
              <Play
                className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))"
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsVideoOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
            >
              <motion.button className="absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black">
                <XIcon className="size-5" />
              </motion.button>
              <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
                <iframe
                  src={videoSrc}
                  className="size-full rounded-2xl"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

```

File: components/sidebar/app-sidebar.tsx
```tsx
/*
<ai_context>
This client component provides the sidebar for the app.
</ai_context>
*/

"use client"

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal
} from "lucide-react"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

// Sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg"
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise"
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup"
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free"
    }
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" }
      ]
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" }
      ]
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" }
      ]
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" }
      ]
    }
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

```

File: components/sidebar/nav-main.tsx
```tsx
/*
<ai_context>
This client component provides a main navigation for the sidebar.
</ai_context>
*/

"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"
import { ChevronRight, type LucideIcon } from "lucide-react"

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: { title: string; url: string }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map(subItem => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

```

File: components/sidebar/nav-projects.tsx
```tsx
/*
<ai_context>
This client component provides a list of projects for the sidebar.
</ai_context>
*/

"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon
} from "lucide-react"

export function NavProjects({
  projects
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map(item => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

```

File: components/sidebar/nav-user.tsx
```tsx
/*
<ai_context>
This client component provides a user button for the sidebar via Clerk.
</ai_context>
*/

"use client"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { UserButton, useUser } from "@clerk/nextjs"

export function NavUser() {
  const { user } = useUser()

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2 font-medium">
        <UserButton afterSignOutUrl="/" />
        {user?.fullName}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

```

File: components/utilities/posthog/posthog-pageview.tsx
```tsx
/*
<ai_context>
This client component tracks pageviews in PostHog.
</ai_context>
*/

"use client"

import { usePathname } from "next/navigation"
import posthog from "posthog-js"
import { useEffect } from "react"

export function PostHogPageview() {
  const pathname = usePathname()

  useEffect(() => {
    // Track a pageview whenever the pathname changes
    if (pathname) {
      posthog.capture("$pageview", { path: pathname })
    }
  }, [pathname])

  return null
}

```

File: components/sidebar/team-switcher.tsx
```tsx
/*
<ai_context>
This client component provides a team switcher for the sidebar.
</ai_context>
*/

"use client"

import { ChevronsUpDown, Plus } from "lucide-react"
import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

```

File: components/utilities/posthog/posthog-provider.tsx
```tsx
/*
<ai_context>
This client component provides the PostHog provider for the app.
</ai_context>
*/

"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only" // or 'always' to create profiles for anonymous users as well
  })
}
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

```

File: components/utilities/posthog/posthog-user-identity.tsx
```tsx
/*
<ai_context>
This client component identifies the user in PostHog.
</ai_context>
*/

"use client"

import { useUser } from "@clerk/nextjs"
import posthog from "posthog-js"
import { useEffect } from "react"

export function PostHogUserIdentify() {
  const { user } = useUser()

  useEffect(() => {
    if (user?.id) {
      // Identify the user in PostHog
      posthog.identify(user.id)
    } else {
      // If no user is signed in, reset any previously identified user
      posthog.reset()
    }
  }, [user?.id])

  return null
}

```

File: components/utilities/providers.tsx
```tsx
/*
<ai_context>
This client component provides the providers for the app.
</ai_context>
*/

"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"
import { CSPostHogProvider } from "./posthog/posthog-provider"

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <CSPostHogProvider>{children}</CSPostHogProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}

```

File: components/utilities/tailwind-indicator.tsx
```tsx
/*
<ai_context>
This server component provides a tailwind indicator for the app in dev mode.
</ai_context>
*/

"use server"

export async function TailwindIndicator() {
  // Don't show in production
  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-12 left-3 z-50 flex size-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}

```

File: components/utilities/theme-switcher.tsx
```tsx
/*
<ai_context>
This client component provides a theme switcher for the app.
</ai_context>
*/

"use client"

import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { HTMLAttributes, ReactNode } from "react"

interface ThemeSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const ThemeSwitcher = ({ children, ...props }: ThemeSwitcherProps) => {
  const { setTheme, theme } = useTheme()

  const handleChange = (theme: "dark" | "light") => {
    localStorage.setItem("theme", theme)
    setTheme(theme)
  }

  return (
    <div
      className={cn(
        "p-1 hover:cursor-pointer hover:opacity-50",
        props.className
      )}
      onClick={() => handleChange(theme === "light" ? "dark" : "light")}
    >
      {theme === "dark" ? (
        <Moon className="size-6" />
      ) : (
        <Sun className="size-6" />
      )}
    </div>
  )
}

```

File: components/header.tsx
```tsx
/*
<ai_context>
This client component provides the header for the app.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs"
import { Menu, Rocket, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ThemeSwitcher } from "./utilities/theme-switcher"

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" }
]

const signedInLinks = [{ href: "/todo", label: "Todo" }]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        isScrolled
          ? "bg-background/80 shadow-sm backdrop-blur-sm"
          : "bg-background"
      }`}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-4">
        <div className="flex items-center space-x-2 hover:cursor-pointer hover:opacity-80">
          <Rocket className="size-6" />
          <Link href="/" className="text-xl font-bold">
            Mckay's App Template
          </Link>
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 space-x-2 font-semibold md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 hover:opacity-80"
            >
              {link.label}
            </Link>
          ))}

          <SignedIn>
            {signedInLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1 hover:opacity-80"
              >
                {link.label}
              </Link>
            ))}
          </SignedIn>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeSwitcher />

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Login</Button>
            </SignInButton>

            <SignUpButton>
              <Button className="bg-blue-500 hover:bg-blue-600">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="bg-primary-foreground text-primary p-4 md:hidden">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="block hover:underline"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block hover:underline"
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <SignedIn>
              {signedInLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block hover:underline"
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </SignedIn>
          </ul>
        </nav>
      )}
    </header>
  )
}

```

File: db/schema/profiles-schema.ts
```ts
/*
<ai_context>
Defines the database schema for profiles.
</ai_context>
*/

import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const membershipEnum = pgEnum("membership", ["free", "pro"])

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  membership: membershipEnum("membership").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertProfile = typeof profilesTable.$inferInsert
export type SelectProfile = typeof profilesTable.$inferSelect

```

File: db/schema/todos-schema.ts
```ts
/*
<ai_context>
Defines the database schema for todos.
</ai_context>
*/

import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const todosTable = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertTodo = typeof todosTable.$inferInsert
export type SelectTodo = typeof todosTable.$inferSelect

```

File: hooks/use-mobile.tsx
```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

```

File: hooks/use-toast.ts
```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

```

File: lib/hooks/use-copy-to-clipboard.tsx
```tsx
/*
<ai_context>
Hook for copying text to the clipboard.
</ai_context>
*/

"use client"

import { useState } from "react"

export interface useCopyToClipboardProps {
  timeout?: number
}

export function useCopyToClipboard({
  timeout = 2000
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState<Boolean>(false)

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return
    }

    if (!value) {
      return
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    })
  }

  return { isCopied, copyToClipboard }
}

```

File: lib/hooks/use-mobile.tsx
```tsx
/*
<ai_context>
Hook to check if the user is on a mobile device.
</ai_context>
*/

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

```

File: lib/hooks/use-toast.ts
```ts
/*
<ai_context>
Hook to display toast notifications.
</ai_context>
*/

"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach(toast => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false
              }
            : t
        )
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: []
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId)
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id }
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: open => {
        if (!open) dismiss()
      }
    }
  })

  return {
    id: id,
    dismiss,
    update
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId })
  }
}

export { toast, useToast }

```

File: lib/stripe.ts
```ts
/*
<ai_context>
Contains the Stripe configuration for the app.
</ai_context>
*/

import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  appInfo: {
    name: "Mckay's App Template",
    version: "0.1.0"
  }
})

```

File: lib/utils.ts
```ts
/*
<ai_context>
Contains the utility functions for the app.
</ai_context>
*/

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

File: types/index.ts
```ts
/*
<ai_context>
Exports the types for the app.
</ai_context>
*/

export * from "./server-action-types"

```

File: types/server-action-types.ts
```ts
/*
<ai_context>
Contains the general server action types.
</ai_context>
*/

export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }

```

File: .env.example
```example
# DB
DATABASE_URL=

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PORTAL_LINK=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

```

File: .eslintrc.json
```json
/*
<ai_context>
Contains the ESLint configuration for the app.
</ai_context>
*/

{
  "$schema": "https://json.schemastore.org/eslintrc",
  "root": true,
  "extends": [
    "next/core-web-vitals",
    "prettier",
    "plugin:tailwindcss/recommended"
  ],
  "plugins": ["tailwindcss"],
  "rules": {
    "@next/next/no-img-element": "off",
    "jsx-a11y/alt-text": "off",
    "react-hooks/exhaustive-deps": "off",
    "tailwindcss/enforces-negative-arbitrary-values": "off",
    "tailwindcss/no-contradicting-classname": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/no-unnecessary-arbitrary-value": "off",
    "react/no-unescaped-entities": "off"
  },
  "settings": {
    "tailwindcss": {
      "callees": ["cn", "cva"],
      "config": "tailwind.config.js"
    }
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "parser": "@typescript-eslint/parser"
    }
  ]
}

```

File: components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

File: drizzle.config.ts
```ts
/*
<ai_context>
Configures Drizzle for the app.
</ai_context>
*/

import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env.local" })

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})

```

File: license
```license
MIT License

Copyright (c) 2024 Mckay Wrigley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

File: middleware.ts
```ts
/*
<ai_context>
Contains middleware for protecting routes, checking user authentication, and redirecting as needed.
</ai_context>
*/

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/todo(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: "/login" })
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && isProtectedRoute(req)) {
    return NextResponse.next()
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}

```

File: next.config.mjs
```mjs
/*
<ai_context>
Configures Next.js for the app.
</ai_context>
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "localhost" }]
  }
}

export default nextConfig

```

File: postcss.config.mjs
```mjs
/*
<ai_context>
Configures PostCSS for the app.
</ai_context>
*/

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}
  }
}

export default config

```

File: prettier.config.cjs
```cjs
/*
<ai_context>
Configures Prettier for the app.
</ai_context>
*/

/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: "lf",
  semi: false,
  useTabs: false,
  singleQuote: false,
  arrowParens: "avoid",
  tabWidth: 2,
  trailingComma: "none",
  importOrder: [
    "^.+\\.scss$",
    "^.+\\.css$",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/registry/(.*)$",
    "^@/styles/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]"
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true
}

```

File: README.md
```md
# Mckay's App Template

This is a full-stack app template for courses on [Takeoff](https://JoinTakeoff.com/).

## Sponsors

If you are interested in sponsoring my repos, please contact me at [ads@takeoffai.org](mailto:ads@takeoffai.org).

Or sponsor me directly on [GitHub Sponsors](https://github.com/sponsors/mckaywrigley).

## Tech Stack

- IDE: [Cursor](https://www.cursor.com/)
- AI Tools: [V0](https://v0.dev/), [Perplexity](https://www.perplexity.com/)
- Frontend: [Next.js](https://nextjs.org/docs), [Tailwind](https://tailwindcss.com/docs/guides/nextjs), [Shadcn](https://ui.shadcn.com/docs/installation), [Framer Motion](https://www.framer.com/motion/introduction/)
- Backend: [PostgreSQL](https://www.postgresql.org/about/), [Supabase](https://supabase.com/), [Drizzle](https://orm.drizzle.team/docs/get-started-postgresql), [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- Auth: [Clerk](https://clerk.com/)
- Payments: [Stripe](https://stripe.com/)
- Analytics: [PostHog](https://posthog.com/)

## Prerequisites

You will need accounts for the following services.

They all have free plans that you can use to get started.

- Create a [Cursor](https://www.cursor.com/) account
- Create a [GitHub](https://github.com/) account
- Create a [Supabase](https://supabase.com/) account
- Create a [Clerk](https://clerk.com/) account
- Create a [Stripe](https://stripe.com/) account
- Create a [PostHog](https://posthog.com/) account
- Create a [Vercel](https://vercel.com/) account

You will likely not need paid plans unless you are building a business.

## Environment Variables

```bash
# DB (Supabase)
DATABASE_URL=

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Payments (Stripe)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PORTAL_LINK=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the environment variables from above
3. Run `npm install` to install dependencies
4. Run `npm run dev` to run the app locally

```

File: tailwind.config.ts
```ts
/*
<ai_context>
Configures Tailwind CSS for the app.
</ai_context>
*/

import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0"
          },
          to: {
            height: "var(--radix-accordion-content-height)"
          }
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)"
          },
          to: {
            height: "0"
          }
        },
        gradient: {
          to: {
            backgroundPosition: "var(--bg-size) 0"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        gradient: "gradient 8s linear infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
} satisfies Config

export default config

```

File: tsconfig.json
```json
/*
<ai_context>
Configures the TypeScript compiler options for the app.
</ai_context>
*/

{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    },
    "target": "ES2017"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

File: .specstory/history/.what-is-this.md
```md
# SpecStory Artifacts Directory
    
This directory is automatically created and maintained by the SpecStory extension to preserve your Cursor composer and chat history.
    
## What's Here?
    
- `.specstory/history`: Contains markdown files of your AI coding sessions
- Each file represents a separate chat or composer session
- Files are automatically updated as you work

## Valuable Uses
    
- Capture: Keep your context window up-to-date when starting new Chat/Composer sessions via @ references
- Search: For previous prompts and code snippets 
- Learn: Meta-analyze your patterns and learn from your past experiences
    
## Version Control
    
We recommend keeping this directory under version control to maintain a history of your AI interactions. However, if you prefer not to version these files, you can exclude them by adding this to your `.gitignore`:
    
```
.specstory/**
```
    
## Searching Your Codebase
    
When searching your codebase in Cursor, search results may include your previous AI coding interactions. To focus solely on your actual code files, you can exclude the AI interaction history from search results.
    
To exclude AI interaction history:
    
1. Open the "Find in Files" search in Cursor (Cmd/Ctrl + Shift + F)
2. Navigate to the "files to exclude" section
3. Add the following pattern:
    
```
.specstory/*
```
    
This will ensure your searches only return results from your working codebase files.

## Notes

- Auto-save only works when Cursor/sqlite flushes data to disk. This results in a small delay after the AI response is complete before SpecStory can save the history.
- Auto-save does not yet work on remote WSL workspaces.

## Settings
    
You can control auto-saving behavior in Cursor:
    
1. Open Cursor → Settings → VS Code Settings (Cmd/Ctrl + ,)
2. Search for "SpecStory"
3. Find "Auto Save" setting to enable/disable
    
Auto-save occurs when changes are detected in Cursor's sqlite database, or every 2 minutes as a safety net.
```

File: actions/db/calculation-actions.ts
```ts
/**
 * @file calculation-actions.ts
 * @description Server actions for computing monthly budget & taxes for a therapist.
 *
 * Exports:
 *   - calculateBudgetAction(userId): 
 *     1) Gathers data from clientsTable, personalExpensesTable, professionalExpensesTable, and therapistSettingsTable
 *     2) Summarizes monthly gross, VAT, IRPF, net income
 *     3) Compares 6-month projected savings with user’s 6-month goal
 * 
 * @notes
 * - The IRPF bracket logic is approximate, based on an annual gross -> bracket approach. 
 * - The returned data is typed as 'any' in the ActionState but can be refined using a TS interface if needed.
 * 
 * @dependencies
 *  - db from "@/db/db"
 *  - eq from "drizzle-orm"
 *  - ActionState from "@/types"
 *  - clientsTable from "@/db/schema/clients-schema"
 *  - personalExpensesTable from "@/db/schema/personal-expenses-schema"
 *  - professionalExpensesTable from "@/db/schema/professional-expenses-schema"
 *  - therapistSettingsTable from "@/db/schema/therapist-settings-schema"
 */

"use server"

import { db } from "@/db/db"
import { clientsTable } from "@/db/schema/clients-schema"
import { personalExpensesTable } from "@/db/schema/personal-expenses-schema"
import { professionalExpensesTable } from "@/db/schema/professional-expenses-schema"
import { therapistSettingsTable } from "@/db/schema/therapist-settings-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"

/**
 * calculateBudgetAction
 * 
 * @param userId The user's ID
 * @returns 
 *   ActionState of an object containing:
 *   {
 *     grossIncome: number,
 *     vat: number,
 *     irpfRate: number,
 *     incomeTax: number,
 *     totalProfessional: number,
 *     totalPersonal: number,
 *     netIncome: number,
 *     projectedSavings: number,
 *     savingsGoal: number,
 *     difference: number
 *   }
 * 
 * Steps:
 *   1. Gross income from all clients (sessionRate * monthlySessions)
 *   2. VAT = 21% of gross
 *   3. IRPF bracket:
 *        - annualGross <= 12450 => 19%
 *        - <= 20200 => 24%
 *        - <= 35200 => 30%
 *        - <= 60000 => 37%
 *        - else => 45%
 *   4. monthly incomeTax = monthlyGross * IRPF rate
 *   5. totalProfessional = sum of all professional expenses
 *   6. totalPersonal = sum of all personal expenses
 *   7. netIncome = grossIncome - totalProfessional - incomeTax - vat - totalPersonal
 *   8. projectedSavings = netIncome * 6
 *   9. savingsGoal = monthlySavingsGoal * 6
 *   10. difference = projectedSavings - savingsGoal
 */
export async function calculateBudgetAction(
  userId: string
): Promise<
  ActionState<{
    grossIncome: number
    vat: number
    irpfRate: number
    incomeTax: number
    totalProfessional: number
    totalPersonal: number
    netIncome: number
    projectedSavings: number
    savingsGoal: number
    difference: number
  }>
> {
  try {
    // 1. Get gross income
    const clients = await db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.userId, userId))

    const grossIncome = clients.reduce((acc, c) => {
      const monthlySessions = Number(c.monthlySessions) || 0
      const sessionRate = Number(c.sessionRate) || 0
      return acc + monthlySessions * sessionRate
    }, 0)

    // 2. 21% VAT
    const vat = grossIncome * 0.21

    // 3. IRPF bracket
    const annualIncome = grossIncome * 12
    let irpfRate = 0

    if (annualIncome <= 12450) {
      irpfRate = 0.19
    } else if (annualIncome <= 20200) {
      irpfRate = 0.24
    } else if (annualIncome <= 35200) {
      irpfRate = 0.30
    } else if (annualIncome <= 60000) {
      irpfRate = 0.37
    } else {
      irpfRate = 0.45
    }

    // 4. monthly income tax
    const incomeTax = grossIncome * irpfRate

    // 5. sum professional expenses
    const professional = await db
      .select()
      .from(professionalExpensesTable)
      .where(eq(professionalExpensesTable.userId, userId))

    const totalProfessional = professional.reduce(
      (acc, e) => acc + Number(e.cost),
      0
    )

    // sum personal expenses
    const personal = await db
      .select()
      .from(personalExpensesTable)
      .where(eq(personalExpensesTable.userId, userId))

    const totalPersonal = personal.reduce((acc, e) => acc + Number(e.cost), 0)

    // 6. netIncome
    const netIncome =
      grossIncome - totalProfessional - incomeTax - vat - totalPersonal

    // 7. get user settings
    const [settings] = await db
      .select()
      .from(therapistSettingsTable)
      .where(eq(therapistSettingsTable.userId, userId))

    const monthlySavingsGoal = Number(settings?.monthlySavingsGoal || 0)
    const savingsGoal = monthlySavingsGoal * 6
    const projectedSavings = netIncome * 6
    const difference = projectedSavings - savingsGoal

    // Return final result
    return {
      isSuccess: true,
      message: "Budget calculated successfully",
      data: {
        grossIncome,
        vat,
        irpfRate,
        incomeTax,
        totalProfessional,
        totalPersonal,
        netIncome,
        projectedSavings,
        savingsGoal,
        difference
      }
    }
  } catch (error) {
    console.error("Error calculating budget:", error)
    return { isSuccess: false, message: "Failed to calculate budget" }
  }
}
```

File: actions/db/personal-expenses-actions.ts
```ts
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

"use server"

import { db } from "@/db/db"
import { personalExpensesTable } from "@/db/schema/personal-expenses-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"

/**
 * createPersonalExpenseAction
 * @param data An object containing userId, description, and cost
 * @returns ActionState with newly created expense or failure
 * 
 * This action inserts a new personal expense in the database for the specified user.
 */
export async function createPersonalExpenseAction(data: {
  userId: string
  description: string
  cost: number
}): Promise<ActionState<any>> {
  try {
    const [newExpense] = await db
      .insert(personalExpensesTable)
      .values({
        userId: data.userId,
        description: data.description,
        cost: data.cost
      })
      .returning()

    return {
      isSuccess: true,
      message: "Personal expense created successfully",
      data: newExpense
    }
  } catch (error) {
    console.error("Error creating personal expense:", error)
    return { isSuccess: false, message: "Failed to create personal expense" }
  }
}

/**
 * getPersonalExpensesAction
 * @param userId The user's ID
 * @returns ActionState with an array of personal expenses belonging to the user
 */
export async function getPersonalExpensesAction(
  userId: string
): Promise<ActionState<any[]>> {
  try {
    const expenses = await db
      .select()
      .from(personalExpensesTable)
      .where(eq(personalExpensesTable.userId, userId))

    return {
      isSuccess: true,
      message: "Personal expenses retrieved successfully",
      data: expenses
    }
  } catch (error) {
    console.error("Error retrieving personal expenses:", error)
    return { isSuccess: false, message: "Failed to retrieve personal expenses" }
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
    description?: string
    cost?: number
  }
): Promise<ActionState<any>> {
  try {
    const [updatedExpense] = await db
      .update(personalExpensesTable)
      .set(data)
      .where(eq(personalExpensesTable.id, expenseId))
      .where(eq(personalExpensesTable.userId, userId))
      .returning()

    if (!updatedExpense) {
      return { isSuccess: false, message: "Personal expense not found" }
    }

    return {
      isSuccess: true,
      message: "Personal expense updated",
      data: updatedExpense
    }
  } catch (error) {
    console.error("Error updating personal expense:", error)
    return { isSuccess: false, message: "Failed to update personal expense" }
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
  userId: string
): Promise<ActionState<void>> {
  try {
    await db
      .delete(personalExpensesTable)
      .where(eq(personalExpensesTable.id, expenseId))
      .where(eq(personalExpensesTable.userId, userId))

    return {
      isSuccess: true,
      message: "Personal expense deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting personal expense:", error)
    return { isSuccess: false, message: "Failed to delete personal expense" }
  }
}
```

File: actions/db/professional-expenses-actions.ts
```ts
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

"use server"

import { db } from "@/db/db"
import { professionalExpensesTable } from "@/db/schema/professional-expenses-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"

/**
 * createProfessionalExpenseAction
 * @param data An object containing userId, description, and cost
 * @returns ActionState with the newly created professional expense or failure
 */
export async function createProfessionalExpenseAction(data: {
  userId: string
  description: string
  cost: number
}): Promise<ActionState<any>> {
  try {
    const [newExpense] = await db
      .insert(professionalExpensesTable)
      .values({
        userId: data.userId,
        description: data.description,
        cost: data.cost
      })
      .returning()

    return {
      isSuccess: true,
      message: "Professional expense created successfully",
      data: newExpense
    }
  } catch (error) {
    console.error("Error creating professional expense:", error)
    return { isSuccess: false, message: "Failed to create professional expense" }
  }
}

/**
 * getProfessionalExpensesAction
 * @param userId The user's ID
 * @returns ActionState with an array of professional expenses belonging to the user
 */
export async function getProfessionalExpensesAction(
  userId: string
): Promise<ActionState<any[]>> {
  try {
    const expenses = await db
      .select()
      .from(professionalExpensesTable)
      .where(eq(professionalExpensesTable.userId, userId))

    return {
      isSuccess: true,
      message: "Professional expenses retrieved successfully",
      data: expenses
    }
  } catch (error) {
    console.error("Error retrieving professional expenses:", error)
    return { isSuccess: false, message: "Failed to retrieve professional expenses" }
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
    description?: string
    cost?: number
  }
): Promise<ActionState<any>> {
  try {
    const [updatedExpense] = await db
      .update(professionalExpensesTable)
      .set(data)
      .where(eq(professionalExpensesTable.id, expenseId))
      .where(eq(professionalExpensesTable.userId, userId))
      .returning()

    if (!updatedExpense) {
      return { isSuccess: false, message: "Professional expense not found" }
    }

    return {
      isSuccess: true,
      message: "Professional expense updated",
      data: updatedExpense
    }
  } catch (error) {
    console.error("Error updating professional expense:", error)
    return { isSuccess: false, message: "Failed to update professional expense" }
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
  userId: string
): Promise<ActionState<void>> {
  try {
    await db
      .delete(professionalExpensesTable)
      .where(eq(professionalExpensesTable.id, expenseId))
      .where(eq(professionalExpensesTable.userId, userId))

    return {
      isSuccess: true,
      message: "Professional expense deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting professional expense:", error)
    return { isSuccess: false, message: "Failed to delete professional expense" }
  }
}
```

File: actions/db/therapist-settings-actions.ts
```ts
/**
 * @file therapist-settings-actions.ts
 * @description Server actions to manage therapist-specific settings in the DB.
 * 
 * These actions handle reading/updating the "therapist_settings" table, which includes:
 *  - monthlySavingsGoal: numeric
 *  - other future expansions
 * 
 * The main actions are:
 *   - getTherapistSettingsAction: retrieve the row for a given user
 *   - setTherapistSettingsAction: upsert logic for the row (create or update)
 * 
 * @notes
 * - If the user doesn't have a row yet, we create it. Otherwise, we update the existing row.
 * - We only store one row per user, hence userId is the unique constraint.
 * - The data returned from Drizzle is typed as 'any' for demonstration. For stricter typing, see the actual schema type.
 * 
 * @dependencies
 *  - db from "@/db/db"
 *  - therapistSettingsTable from "@/db/schema/therapist-settings-schema"
 *  - eq from "drizzle-orm"
 *  - ActionState from "@/types"
 */

"use server"

import { db } from "@/db/db"
import { therapistSettingsTable } from "@/db/schema/therapist-settings-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"

/**
 * setTherapistSettingsAction
 * @description
 *   Upserts the therapist settings for a given user. If no row found, create one; otherwise update.
 * 
 * @param userId The user's ID
 * @param monthlySavingsGoal The monthly savings goal in numeric form
 * @returns ActionState with updated/created row
 */
export async function setTherapistSettingsAction(
  userId: string,
  monthlySavingsGoal: number
): Promise<ActionState<any>> {
  try {
    // Attempt to find an existing row
    const existing = await db
      .select()
      .from(therapistSettingsTable)
      .where(eq(therapistSettingsTable.userId, userId))

    let result: any

    if (existing.length > 0) {
      // Update
      const [updated] = await db
        .update(therapistSettingsTable)
        .set({ monthlySavingsGoal })
        .where(eq(therapistSettingsTable.userId, userId))
        .returning()

      result = updated
    } else {
      // Insert
      const [inserted] = await db
        .insert(therapistSettingsTable)
        .values({
          userId,
          monthlySavingsGoal
        })
        .returning()

      result = inserted
    }

    return {
      isSuccess: true,
      message: "Therapist settings updated",
      data: result
    }
  } catch (error) {
    console.error("Error setting therapist settings:", error)
    return { isSuccess: false, message: "Failed to set therapist settings" }
  }
}

/**
 * getTherapistSettingsAction
 * @description
 *   Retrieves therapist settings for a given user ID
 * 
 * @param userId The user's ID
 * @returns ActionState with the row if found, otherwise no data
 */
export async function getTherapistSettingsAction(
  userId: string
): Promise<ActionState<any>> {
  try {
    const [settings] = await db
      .select()
      .from(therapistSettingsTable)
      .where(eq(therapistSettingsTable.userId, userId))

    return {
      isSuccess: true,
      message: "Therapist settings fetched",
      data: settings
    }
  } catch (error) {
    console.error("Error retrieving therapist settings:", error)
    return { isSuccess: false, message: "Failed to get therapist settings" }
  }
}
```

File: actions/db/clients-actions.ts
```ts
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

```

File: app/clients/_components/client-list.tsx
```tsx
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

import { createClientAction, deleteClientAction, updateClientAction } from "@/actions/db/clients-actions"
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
export default function ClientList({ userId, initialClients }: ClientListProps) {
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
      sessionRate: newRate,
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
  const handleUpdateField = (clientId: string, field: keyof Client, value: string | number) => {
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
      <div className="border rounded-lg p-4 space-y-3 max-w-md bg-card">
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
          <Button onClick={handleCreateClient}>
            Create Client
          </Button>
        </div>
      </div>

      {/* List of existing clients */}
      {clients.length === 0 ? (
        <p className="text-muted-foreground">No clients found.</p>
      ) : (
        <table className="w-full border rounded-lg overflow-hidden">
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
              <tr key={client.id} className="border-b last:border-b-0 hover:bg-muted/50">
                <td className="p-2">
                  <Input 
                    value={client.name}
                    onChange={e => handleUpdateField(client.id, "name", e.target.value)}
                    className="max-w-xs"
                  />
                </td>
                <td className="p-2">
                  <Input 
                    type="number"
                    value={client.monthlySessions.toString()}
                    onChange={e => handleUpdateField(client.id, "monthlySessions", Number(e.target.value))}
                    className="max-w-[80px]"
                  />
                </td>
                <td className="p-2">
                  <Input 
                    type="number"
                    value={client.sessionRate.toString()}
                    onChange={e => handleUpdateField(client.id, "sessionRate", Number(e.target.value))}
                    className="max-w-[80px]"
                  />
                </td>
                <td className="p-2 flex items-center gap-2 justify-end">
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
```

File: app/clients/layout.tsx
```tsx
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
  return (
    <div className="min-h-screen w-full bg-background">
      {children}
    </div>
  )
}
```

File: db/schema/index.ts
```ts
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

```

File: db/schema/clients-schema.ts
```ts
/**
 * @file clients-schema.ts
 * @description
 * This file defines the schema for the "clients" table using Drizzle ORM and PostgreSQL.
 * It stores client data for each therapist, including monthly sessions and session rate,
 * which is used to calculate gross monthly income.
 *
 * Table Fields:
 *  - id (UUID): Primary key, auto-generated
 *  - userId (text): The Clerk user ID of the therapist
 *  - name (text): Name of the client
 *  - monthlySessions (integer): Number of sessions per month for this client
 *  - sessionRate (numeric): Rate charged per session
 *  - createdAt (timestamp): Timestamp of creation
 *  - updatedAt (timestamp): Timestamp of last update, automatically updated
 *
 * Exports:
 *  - clientsTable: The Drizzle table definition
 *  - InsertClient: Type for inserting a new client row
 *  - SelectClient: Type for selecting a client row
 *
 * @dependencies
 *  - drizzle-orm/pg-core for pgTable, text, integer, numeric, timestamp, uuid
 *
 * @notes
 *  - We use numeric(10,2) for monetary values to handle up to 2 decimal places
 *  - We rely on the userId from Clerk to link each record to a specific therapist
 */

import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  uuid
} from "drizzle-orm/pg-core"

/**
 * Defines the "clients" table, storing basic info about each therapist's clients.
 */
export const clientsTable = pgTable("clients", {
  /**
   * Unique ID for each client entry
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * The Clerk user ID of the therapist
   */
  userId: text("user_id").notNull(),

  /**
   * Client's name
   */
  name: text("name").notNull(),

  /**
   * Number of sessions per month
   */
  monthlySessions: integer("monthly_sessions").default(0).notNull(),

  /**
   * Session rate in cents, 10 dollars is 1000.
   */
  sessionRate: integer("session_rate").default(0).notNull(),

  /**
   * Timestamp of creation
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Timestamp of update, automatically updated on modification
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new client record.
 */
export type InsertClient = typeof clientsTable.$inferInsert

/**
 * Type for selecting an existing client record.
 */
export type SelectClient = typeof clientsTable.$inferSelect

```

File: app/clients/page.tsx
```tsx
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
      <ClientList 
        userId={userId} 
        initialClients={clients || []}
      />
    </div>
  )
}
```

File: db/schema/personal-expenses-schema.ts
```ts
/**
 * @file personal-expenses-schema.ts
 * @description
 * Defines the schema for the "personal_expenses" table, which tracks expenses
 * that do not directly relate to professional costs. These expenses reduce
 * net monthly income but do not reduce taxable income for the business side.
 *
 * Table Fields:
 *  - id (UUID): Primary key, auto-generated
 *  - userId (text): The Clerk user ID of the therapist
 *  - description (text): Short description of the personal expense
 *  - cost (numeric): The expense amount in currency with two decimals
 *  - createdAt (timestamp): Timestamp of record creation
 *  - updatedAt (timestamp): Timestamp of last update, automatically updated
 *
 * Exports:
 *  - personalExpensesTable: The Drizzle table definition
 *  - InsertPersonalExpense: Type for inserting a new personal expense
 *  - SelectPersonalExpense: Type for selecting a personal expense
 *
 * @dependencies
 *  - drizzle-orm/pg-core
 *
 * @notes
 *  - "cost" is stored with numeric(10,2) for monetary values
 */

import {
  pgTable,
  text,
  numeric,
  timestamp,
  uuid,
  integer
} from "drizzle-orm/pg-core"

/**
 * Defines the "personal_expenses" table, storing non-business (personal) expense info.
 */
export const personalExpensesTable = pgTable("personal_expenses", {
  /**
   * UUID primary key
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * The Clerk user ID of the therapist
   */
  userId: text("user_id").notNull(),

  /**
   * Description of the personal expense
   */
  description: text("description").notNull(),

  /**
   * Monetary cost of this personal expense in cents
   */
  cost: integer("cost").default(0).notNull(),

  /**
   * Record creation timestamp
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Record update timestamp (auto-updates on changes)
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new personal expense record.
 */
export type InsertPersonalExpense = typeof personalExpensesTable.$inferInsert

/**
 * Type for selecting a personal expense record.
 */
export type SelectPersonalExpense = typeof personalExpensesTable.$inferSelect

```

File: db/schema/therapist-settings-schema.ts
```ts
/**
 * @file therapist-settings-schema.ts
 * @description
 * Defines the schema for the "therapist_settings" table, which stores
 * user-specific configuration for the budgeting application, such as
 * the monthly savings goal. This can be used to project 6-month savings.
 *
 * Table Fields:
 *  - id (UUID): Primary key, auto-generated
 *  - userId (text): The Clerk user ID of the therapist
 *  - monthlySavingsGoal (numeric): The monthly savings goal
 *  - createdAt (timestamp): Timestamp of record creation
 *  - updatedAt (timestamp): Timestamp of last update
 *
 * Exports:
 *  - therapistSettingsTable: The Drizzle table definition
 *  - InsertTherapistSettings: Type for inserting new settings
 *  - SelectTherapistSettings: Type for selecting existing settings
 *
 * @dependencies
 *  - drizzle-orm/pg-core
 *
 * @notes
 *  - monthlySavingsGoal is numeric(10,2) to handle typical currency-like values
 */

import {
  pgTable,
  text,
  numeric,
  timestamp,
  uuid,
  integer
} from "drizzle-orm/pg-core"

/**
 * Defines the "therapist_settings" table for storing user-specific budget config.
 */
export const therapistSettingsTable = pgTable("therapist_settings", {
  /**
   * UUID primary key
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * The Clerk user ID of the therapist
   */
  userId: text("user_id").notNull(),

  /**
   * The monthly savings goal (numeric, e.g., currency)
   */
  monthlySavingsGoal: integer("monthly_savings_goal").default(0).notNull(),

  /**
   * Creation timestamp
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Last update timestamp (auto-updates on changes)
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new therapist settings record.
 */
export type InsertTherapistSettings = typeof therapistSettingsTable.$inferInsert

/**
 * Type for selecting an existing therapist settings record.
 */
export type SelectTherapistSettings = typeof therapistSettingsTable.$inferSelect

```

File: db/db.ts
```ts
/**
 * @file db.ts
 * @description
 * Initializes the database connection using Drizzle ORM over Postgres.js.
 * Exports a `db` instance bound to the combined schema.
 *
 * This file merges the old schemas (profiles, todos) with newly added:
 *   - clientsTable
 *   - personalExpensesTable
 *   - professionalExpensesTable
 *   - therapistSettingsTable
 *
 * @dependencies
 *  - postgres from "postgres"
 *  - drizzle from "drizzle-orm/postgres-js"
 *  - config from "dotenv"
 *  - Database schemas from ./schema
 *
 * @notes
 *  - Make sure to have the .env.local with DATABASE_URL
 *  - The schema object is used for type-safe referencing in queries
 */

import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import {
  profilesTable,
  todosTable,
  clientsTable,
  personalExpensesTable,
  professionalExpensesTable,
  therapistSettingsTable
} from "@/db/schema"

config({ path: ".env.local" })

/**
 * The combined schema object for all of our tables, to be used for Drizzle queries.
 */
const schema = {
  profiles: profilesTable,
  todos: todosTable,
  clients: clientsTable,
  personalExpenses: personalExpensesTable,
  professionalExpenses: professionalExpensesTable,
  therapistSettings: therapistSettingsTable
}

/**
 * Postgres.js client, reading from process.env.DATABASE_URL
 */
const client = postgres(process.env.DATABASE_URL!)

/**
 * The main Drizzle database instance.
 */
export const db = drizzle(client, { schema })

```

File: db/schema/professional-expenses-schema.ts
```ts
/**
 * @file professional-expenses-schema.ts
 * @description
 * Defines the schema for the "professional_expenses" table, which tracks expenses
 * related to the business/therapist's professional activities. These expenses
 * reduce taxable income for the business.
 *
 * Table Fields:
 *  - id (UUID): Primary key, auto-generated
 *  - userId (text): The Clerk user ID of the therapist
 *  - description (text): Description of the professional expense
 *  - cost (numeric): The expense amount in currency with two decimals
 *  - createdAt (timestamp): Timestamp of record creation
 *  - updatedAt (timestamp): Timestamp of last update
 *
 * Exports:
 *  - professionalExpensesTable: The Drizzle table definition
 *  - InsertProfessionalExpense: Type for inserting a new professional expense
 *  - SelectProfessionalExpense: Type for selecting a professional expense
 *
 * @dependencies
 *  - drizzle-orm/pg-core
 *
 * @notes
 *  - "cost" is stored as numeric(10,2) for monetary values
 */

import {
  pgTable,
  text,
  numeric,
  timestamp,
  uuid,
  integer
} from "drizzle-orm/pg-core"

/**
 * Defines the "professional_expenses" table, storing business-related expenses.
 */
export const professionalExpensesTable = pgTable("professional_expenses", {
  /**
   * UUID primary key
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * The Clerk user ID of the therapist
   */
  userId: text("user_id").notNull(),

  /**
   * Description of the professional expense
   */
  description: text("description").notNull(),

  /**
   * Monetary cost of this professional expense
   */
  cost: integer("cost").default(0).notNull(),

  /**
   * Creation timestamp
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),

  /**
   * Last update timestamp (auto-updates on changes)
   */
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new professional expense record.
 */
export type InsertProfessionalExpense =
  typeof professionalExpensesTable.$inferInsert

/**
 * Type for selecting a professional expense record.
 */
export type SelectProfessionalExpense =
  typeof professionalExpensesTable.$inferSelect

```

File: package.json
```json
{
  "name": "mckays-app-template",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "npm run lint:fix && npm run format:write",
    "type-check": "tsc --noEmit",
    "lint:fix": "next lint --fix",
    "format:write": "prettier --write \"{app,lib,db,components,context,types}/**/*.{ts,tsx}\" --cache",
    "format:check": "prettier --check \"{app,lib,db,components,context,types}**/*.{ts,tsx}\" --cache",
    "analyze": "ANALYZE=true npm run build",
    "db:generate": "npx drizzle-kit generate",
    "db:migrate": "npx drizzle-kit migrate",
    "prepare": "husky install"
  },
  "dependencies": {
    "@clerk/backend": "^1.20.1",
    "@clerk/nextjs": "^6.8.1",
    "@clerk/themes": "^2.1.53",
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-aspect-ratio": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.2",
    "@radix-ui/react-context-menu": "^2.2.4",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-hover-card": "^1.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-menubar": "^1.1.4",
    "@radix-ui/react-navigation-menu": "^1.2.3",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@radix-ui/react-toggle": "^1.1.1",
    "@radix-ui/react-toggle-group": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.33.0",
    "embla-carousel-react": "^8.5.1",
    "framer-motion": "^11.11.8",
    "input-otp": "^1.4.1",
    "lucide-react": "^0.436.0",
    "next": "^15.0.3",
    "next-themes": "^0.3.0",
    "postgres": "^3.4.4",
    "posthog-js": "^1.201.0",
    "react": "^16.8 || ^17.0 || ^18.0 || ^19.0",
    "react-day-picker": "^8.10.1",
    "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0",
    "react-hook-form": "^7.54.1",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.0",
    "sonner": "^1.7.1",
    "stripe": "^16.9.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@types/node": "^20",
    "@types/react": "^16.8 || ^17.0 || ^18.0 || ^19.0",
    "@types/react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0",
    "dotenv": "^16.4.5",
    "drizzle-kit": "^0.24.2",
    "eslint": "^8",
    "eslint-config-next": "14.2.7",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-tailwindcss": "^3.17.5",
    "husky": "^9.1.6",
    "postcss": "^8",
    "prettier": "^3.3.3",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  },
  "packageManager": "pnpm@9.15.2+sha512.93e57b0126f0df74ce6bff29680394c0ba54ec47246b9cf321f0121d8d9bb03f750a705f24edc3c1180853afd7c2c3b94196d0a3d53d3e069d9e2793ef11f321"
}

```

File: .env
```env
# Recommended for most uses
DATABASE_URL=postgres://neondb_owner:npg_32XEUSomVDxw@ep-hidden-thunder-a4mt1cit-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PORTAL_LINK=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

```
</file_contents>


</existing_code>

Your task is to:
1. Identify the next incomplete step from the implementation plan (marked with `- [ ]`)
2. Generate the necessary code for all files specified in that step
3. Return the generated code

The implementation plan is just a suggestion meant to provide a high-level overview of the objective. Use it to guide you, but you do not have to adhere to it strictly. Make sure to follow the given rules as you work along the lines of the plan.

For EVERY file you modify or create, you MUST provide the COMPLETE file contents in the format above.

Guidelines for code changes:
- Do not get lazy. Always output the full code in the XML section.
- Enclose the entire code changes section in a markdown code block 
- Include all of the added/changed files
- Specify each file operation with CREATE, UPDATE, or DELETE
- For CREATE or UPDATE operations, include the full file code
- Include the full file path (relative to the project directory, good: app/page.tsx, bad: /Users/username/Desktop/projects/new-chat-template/app/page.tsx)
- Enclose the code with ![CDATA[__CODE HERE__]]
- Use the following XML structure:

```xml
<code_changes>
  <changed_files>
    <file>
      <file_operation>__FILE OPERATION HERE__</file_operation>
      <file_path>__FILE PATH HERE__</file_path>
      <file_code><![CDATA[
/**
 * @file Example component for demonstrating component structure
 * @description 
 * This component handles [specific functionality].
 * It is responsible for [specific responsibilities].
 * 
 * Key features:
 * - Feature 1: Description
 * - Feature 2: Description
 * 
 * @dependencies
 * - DependencyA: Used for X
 * - DependencyB: Used for Y
 * 
 * @notes
 * - Important implementation detail 1
 * - Important implementation detail 2
 */

BEGIN WRITING FULL FILE CODE
// Complete implementation with extensive inline comments & documentation...
]]></file_code>
    </file>
    **REMAINING FILES HERE**
  </changed_files>
</code_changes>
```

Documentation requirements:
- File-level documentation explaining the purpose and scope
- Component/function-level documentation detailing inputs, outputs, and behavior
- Inline comments explaining complex logic or business rules
- Type documentation for all interfaces and types
- Notes about edge cases and error handling
- Any assumptions or limitations

Guidelines:
- Implement exactly one step at a time
- Ensure all code follows the project rules and technical specification
- Include ALL necessary imports and dependencies
- Write clean, well-documented code with appropriate error handling
- Always provide COMPLETE file contents - never use ellipsis (...) or placeholder comments
- Never skip any sections of any file - provide the entire file every time
- Handle edge cases and add input validation where appropriate
- Follow TypeScript best practices and ensure type safety
- Include necessary tests as specified in the testing strategy

Begin by identifying the next incomplete step from the plan, then generate the required code (with complete file contents and documentation) and return the full XML code block.

Above each file, include a "Here's what I did and why" explanation of what you did for that file.

Then end with "STEP X COMPLETE. Here's what I did and why:" followed by an explanation of what you did and then a "USER INSTRUCTIONS: Please do the following:" followed by manual instructions for the user for things you can't do like installing libraries, updating configurations on services, etc.

You also have permission to update the implementation plan if needed. If you update the implementation plan, include each modified step in full and return them as markdown code blocks at the end of the user instructions. No need to mark the current step as complete - that is implied.