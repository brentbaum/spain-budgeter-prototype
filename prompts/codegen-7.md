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
- [x] **Step 5: Personal Expenses Page**
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

- [x] **Step 6: Main Dashboard (Net Income + 6-month Projection)**
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