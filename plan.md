# Implementation Plan: The Evaluation Workbench

## 1. Problem Statement & Goal

### Problem

Iterating on and evaluating the performance of LLM prompts is a chaotic and unstructured process. It is difficult to track changes to a prompt over time, manage a consistent set of test cases, and objectively compare the outputs of different prompt versions. This makes it hard to answer the critical question: "Is this new version of my prompt actually better than the old one?"

### Goal

To solve this, we will build an **Evaluation Workbench**, a core feature in the Prompt Dojo application. This workbench will provide a structured environment where users can:

1.  Create and manage a reusable suite of test cases for a specific prompt.
2.  Run this test suite against any version of the prompt—past or present.
3.  View and compare the outputs of different prompt versions side-by-side in a clear, intuitive interface.
4.  Persist every test run, creating a historical log of prompt performance over time.

## 2. Existing Project Structure

This project is a Bun workspace monorepo with a decoupled architecture. A developer working on this feature must be familiar with the following structure:

- `packages/client`:
  The frontend application, built with **Nuxt.js 4** (using Vue 3). It uses **TanStack Query** for state management, **Shadcn Vue** for the component library, and **Tailwind CSS** for styling.

- `packages/backend`:
  The backend API, built with **Hono.js**. It uses **oRPC** for type-safe RPC-style communication between the frontend and backend.

- `packages/db`:
  The database layer, which uses **Drizzle ORM** to interact with a **SQLite** database. All database schema definitions are located here.

## 3. Core Architectural Decisions

Before beginning implementation, it is crucial to understand two key architectural decisions:

1.  **Reusable Test Cases (Decoupled from Versions):** We will intentionally **not** tie a test case to a specific prompt version. Instead, a test case belongs to the parent prompt. This is achieved by using `prompt_id` in the `test_cases` table instead of `prompt_version_id`. The reasoning is simple: if a user has 50 test cases, they should not have to duplicate all 50 just because they fixed a typo in their prompt. This model enables true regression testing.

2.  **Graceful Variable Handling:** Prompt templates and test case variables will inevitably fall out of sync. Our philosophy is to handle this gracefully. The application logic will substitute the variables it can find in a test case's input JSON and simply ignore any that are missing from the template or extra in the JSON. This is why the `input` field is a flexible JSON blob, to avoid rigid database constraints.

## 4. Step-by-Step Implementation Plan

This plan is broken down into backend and frontend tasks. It is recommended to complete the backend tasks first.

### Part A: Backend Implementation

**1. Modify Database Schema**

- **File:** `packages/db/schema.ts`
- **Action:** In the `testCasesTable` object, find the `promptVersionId` column.
- **Change:** Rename it to `promptId` and change its reference to point to the `promptsTable.id` column. The new definition should be:
  ```typescript
  promptId: int("prompt_id").notNull().references(() => promptsTable.id, { onDelete: "cascade" }),
  ```

**2. Create Test Case API**

- **Action:** Create a new directory: `packages/backend/src/routes/test-cases/`.
- **Action:** Inside this new directory, create two files: `schema.ts` for Zod schemas and `index.ts` for the oRPC procedures.
- **`schema.ts`:** Define Zod schemas for creating, updating, and listing test cases.
- **`index.ts`:** Implement the following oRPC procedures:
  - `list(input: { promptId: number })`: Fetches all test cases for a given `promptId`.
  - `create(input: { promptId: number, title: string, input: object })`: Creates a new test case.
  - `delete(input: { id: number })`: Deletes a test case by its ID.

**3. Create Evaluation API**

- **Action:** Create a new directory: `packages/backend/src/routes/evaluations/`.
- **Action:** Create `schema.ts` and `index.ts` files within it.
- **`index.ts`:** Implement the following procedures:
  - `list(input: { promptId: number })`: Fetches all saved evaluation results for all test cases associated with a given `promptId`.
  - `run(input: { testCaseId: number, promptVersionId: number, model: string })`: This is the main execution endpoint.
    1.  Fetch the specified `prompt_versions` template and `test_cases` input data.
    2.  Perform the variable substitution in memory to create the final prompt string.
    3.  **[Placeholder]** Make the call to the target LLM with the final prompt.
    4.  Before saving, **delete** any existing row in the `evaluations` table where `test_case_id` and `prompt_version_id` match the input. This ensures the latest run always replaces the old one.
    5.  **Insert** a new row into the `evaluations` table with the AI's output and other metadata.

**4. Update Main API Router**

- **File:** `packages/backend/src/routes/index.ts`
- **Action:** Import the new procedures from `test-cases` and `evaluations` and add them to the main `router` object, exposing them to the client.

### Part B: Frontend Implementation

**1. Implement Test Case Creation UI**

- **File to Create:** `packages/client/app/pages/project/components/CreateTestCaseDialog.vue`
- **Action:** Build a dialog component that contains a form for creating a new test case. This form should include fields for a `title` and dynamically generate input fields based on the variables parsed from the **latest** prompt version's template. Use the `parsePromptTemplate` utility for this.
- **Logic:** The form submission should call the `testCases.create` mutation.

**2. Build the Evaluation Workbench UI**

- **File to Modify:** `packages/client/app/pages/project/[projectId]/prompt/[promptId]/index.vue`
- **Action:** Implement the UI as designed in `scratch.md`. This includes:
  - The `Base Version` and `Compare Version` dropdowns.
  - The `Run All Tests` button (with a dropdown for the "Force Rerun" option).
  - The main comparison table with columns for Test Case, Base Output, Compare Output, and Actions.

**3. Implement Frontend Data Logic**

- **Data Fetching:** Use TanStack Query's `useQuery` hook to fetch all necessary data on page load: the prompt details, all its versions, all its associated test cases, and all its existing evaluations.
- **Data Mutations:** Use `useMutation` for all actions that change data:
  - Creating a new test case.
  - Running a single evaluation (`evaluations.run`).
  - Running all pending evaluations.
- **UI Logic:** Write the client-side logic to map the fetched data to the comparison table. The logic must correctly place existing evaluation results in the table and display `[Run]` buttons for missing results.
- **Diff View:** Implement the `[View Diff]` button. When clicked, it should open a dialog and use a library like `diff` or `diff2html` to render a user-friendly, color-coded diff of the two outputs.
