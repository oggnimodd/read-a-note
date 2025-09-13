# Agent Guidelines for Codebase Interaction

This document outlines the conventions and commands for agents operating within this repository.

## 1. Build, Lint, and Test Commands

- **General Test Command:** `bun run test` (runs all tests in the package)
- **Run a Single Test:** `bun run test path/to/test/file.test.ts` (run a specific test file)
- **Linting:** `bun run format` (uses Prettier/Biome for formatting, which includes some linting). You don't need to format and lint everytime you do something, formatting is done automatically.
- **Building:**
  - `packages/client`: `bun run build`
  - `packages/backend`: `bun run dev` (main entry, no explicit build script)

## 5. Incremental Test-Driven Development Approach

When implementing new features or adding tests, follow this systematic approach:

1. **One Test at a Time**: Create and run one test case at a time, ensuring each test passes before moving to the next one.
2. **Complete Functionality Coverage**: Ensure all procedures in a route are tested (list, create, get, update, delete).
3. **Positive and Negative Cases**: For each procedure, include both positive test cases (valid inputs) and negative test cases (error conditions).
4. **Proper Test Isolation**: Use beforeEach hooks to clean up the database between tests, ensuring each test runs in isolation.
5. **Verification of Side Effects**: For operations like delete and update, verify not just the return value but also the side effects (e.g., that a deleted item is actually gone).

Benefits of this approach:

- Each test is focused and easier to debug if it fails
- The test suite builds incrementally with confidence
- All functionality is thoroughly tested
- Both success paths and error paths are validated

## 2. Code Style Guidelines

### General Rules

- **Imports:** Organize imports alphabetically and group them by type. Biome's `organizeImports` is enabled.
- **Formatting:** Adhere to Biome/Prettier settings: 2-space indentation, 80-character line width, double quotes, always semicolons.
- **Types:** Use type hints consistently for functions, variables, and class members. Avoid explicit return types for functions unless necessary (TypeScript can infer).
- **Naming Conventions:** Variables/functions: `snake_case`, Classes: `PascalCase`, Constants: `UPPER_SNAKE_CASE`.
- **Error Handling:** Use explicit error handling (e.g., `try-catch` blocks).
- **Comments:** Add comments sparingly, focusing on _why_ complex logic is implemented. **STRICTLY FORBIDDEN:** Do not add semantically useless comments or comments at the end of a line.
- **Modularity:** Break down large functions and classes into smaller, focused units.
- **Function Parameters:** If a function has more than one parameter, use an object as the parameter.

### Client-Side (Nuxt.js & Vue.js) Specific Rules

- **VueUse:** Leverage VueUse for Vue Composition Utilities. For documentation, use Context7 with library ID `vueuse/vueuse`.
- **Shadcn Vue:** Utilize Shadcn Vue components for UI. Components are auto-imported.

  **MANDATORY USAGE WORKFLOW:**
  1. **Verify Component Existence:** Before using any Shadcn component, you **MUST** first verify it is already installed by listing the contents of the `packages/client/app/components/ui/` directory.
  2. **Install if Missing:** If the component is not present, you **MUST** install it using the command: `bunx --bun shadcn-vue@latest add <component-name>`.

  #### Available Shadcn Vue Components:
  - Accordion
  - Alert
  - Alert Dialog
  - Aspect Ratio
  - Avatar
  - Badge
  - Breadcrumb
  - Button
  - Calendar
  - Carousel
  - Checkbox
  - Collapsible
  - Combobox
  - Command
  - Context Menu
  - Data Table
  - Date Picker
  - Dialog
  - Drawer
  - Dropdown Menu
  - Form
  - Hover Card
  - Input
  - Label
  - Menubar
  - Navigation Menu
  - Number Field
  - Pagination
  - PIN Input
  - Popover
  - Progress
  - Radio Group
  - Range Calendar
  - Resizable
  - Scroll Area
  - Select
  - Separator
  - Sheet
  - Skeleton
  - Slider
  - Sonner
  - Stepper
  - Switch
  - Table
  - Tabs
  - Tags Input
  - Textarea
  - Toast
  - Toggle
  - Toggle Group
  - Tooltip

- **Nuxt.js Auto-Imports:** Core functionalities (Vue, Nuxt runtime, Vue Router), components from `~/components` and `~/pages/**/components`, and Pinia stores from `~/stores` and `~/pages/**/stores` are auto-imported. VueUse utilities generally need manual import.
  - **STRICTLY FORBIDDEN:** Do not manually import anything that is auto-imported by Nuxt. This includes, but is not limited to, components from `~/components` and core Vue functions like `ref`, `reactive`, `computed`, etc.
- **Pinia Stores:** Follow `[featureName]Store.ts` naming convention.
- **Icons:** Prefer Nuxt Icon module with Lucide icons: `<Icon name="lucide:<icon-name>" />`.
- **Nuxt Version:** Nuxt 4 is used. For documentation, use Context7 with library ID `nuxt/nuxt` or `websites/nuxt-4.x`.
- **Vue Component Tag Order:** `<script setup lang="ts">`, then `<template>`, then `<style>`. If `<style>` uses `@apply`, include `@import "~/assets/css/main.css";`.
- **Feature-Based Folder Structure:** Components and Pinia stores in `components/` and `stores/` sub-folders are auto-imported. Composables in `composables/` sub-folders need manual import.
- **Server-Side Auto-Imports:** Nuxt.js provides advanced auto-imports for server-side utilities (e.g., `defineEventHandler`, `readBody`).
- **Component Communication:** Prefer functions as props over the `emit` pattern.
- **Button Styling:** Use `<Button>` component directly. For styling `<NuxtLink>` as a button, use `buttonVariants`.
- **Class Variance Authority (CVA):** Shadcn Vue components, and their derivatives, leverage `class-variance-authority` (CVA) to define flexible and type-safe component variants. CVA allows you to define a base set of styles, and then specify different `variants` (e.g., `intent`, `size`) with their corresponding classes. It also supports `compoundVariants` for applying styles based on combinations of variants, and `defaultVariants` for setting initial states. This approach promotes consistency and reusability in styling. You can use `buttonVariants` (exported from `~/components/ui/button/index.ts`) in conjunction with the `cn` utility (from `~/lib/utils.ts`) to apply button styles to non-Button components like `NuxtLink`. Here's how it works:
  - **`class-variance-authority` (CVA):** This library allows you to define component styles in a structured way, making it easy to manage different visual variations (variants) of a component. It defines a base set of styles and then allows you to specify different variants (e.g., `intent`, `size`) with their corresponding classes. It also supports `compoundVariants` for applying styles based on combinations of variants, and `defaultVariants` for setting initial states.
  - **`buttonVariants`:** This is a CVA function (exported from `~/components/ui/button/index.ts`) that defines the different style variations for the `<Button>` component. It allows you to easily apply different styles based on the `variant` and `size` props.
  - **`cn` utility:** This utility (from `~/lib/utils.ts`) is used to merge Tailwind CSS classes. It's important because it ensures that classes are applied in the correct order and that any conflicting styles are resolved correctly. Tailwind's [Precedence and conflict resolution](https://tailwindcss.com/docs/precedence-and-conflict-resolution) rules are followed.
  - **Using `buttonVariants` with `cn`:** To style a non-`<Button>` component (like `<NuxtLink>`) with button styles, you use `buttonVariants` to generate the base button classes and then use `cn` to merge those classes with any other custom classes you want to apply. For example:
    ```vue
    <NuxtLink
      :to="`/project/${project.id}`"
      :class="
        cn(
          buttonVariants({ size: 'sm', variant: 'secondary' }),
          'additional-classes'
        )
      "
    >
      Open Project
    </NuxtLink>
    ```
    In this example, `buttonVariants({ size: 'sm', variant: 'secondary' })` generates the Tailwind CSS classes for a small, secondary button. Then, `cn` merges those classes with any `additional-classes` you provide, ensuring that all the styles are applied correctly.

## 3. Project Structure and Technologies

This repository is a **Bun workspace monorepo** with three main packages:

- `packages/client`: The Nuxt.js UI application.
- `packages/backend`: The decoupled backend API, located at `packages/backend/src/index.ts`.
- `packages/db`: The database layer.

**Backend Technologies:**

- **ORPC:** Used for RPC communication. For documentation, use Context7 with library ID `unnoq/orpc`.
- **Hono.js:** Used as the web framework. For documentation, use Context7 with library ID `honojs/hono`.

**Database Technologies:**

- **Drizzle ORM:** Used as the ORM. For documentation, use Context7 with library ID `drizzle-team/drizzle-orm`.
- **SQLite:** Used as the database.

**Client-Side UI Framework:**

- **Shadcn Vue:** Used for UI components. For documentation, use Context7 with library ID `unovue/shadcn-vue`.

**TanStack Query Integration:**

- The oRPC client is wrapped with TanStack Query for Vue in `packages/client/app/lib/orpc.ts`.
- Vue Query is initialized through a Nuxt plugin at `packages/client/app/plugins/vue-query.ts`.
- **Golden Rule:** Always use the oRPC helper methods (`queryOptions`, `mutationOptions`, `key`) to ensure type safety and proper key generation.
  - **STRICTLY FORBIDDEN:** Do **not** write manual `queryFn` or `mutationFn` calls. All interactions with TanStack Query **MUST** use the provided oRPC helpers.

  - **Queries:** Use `orpc.procedure.queryOptions` directly inside `useQuery`.

    ```typescript
    import { orpc } from "~/lib/orpc";
    import { useQuery } from "@tanstack/vue-query";

    const { data, error } = useQuery(
      orpc.projects.get.queryOptions({
        input: { id: 1 },
      })
    );
    ```

  - **Mutations:** Use `orpc.procedure.mutationOptions` directly inside `useMutation`.

    ```typescript
    import { orpc } from "~/lib/orpc";
    import { useMutation } from "@tanstack/vue-query";

    const { mutate } = useMutation(
      orpc.projects.delete.mutationOptions({
        onSuccess: () => {
          // ...
        },
      })
    );
    ```

  - **Query Keys:** Use the `.key()` helpers for invalidation, setting query data, etc.

    ```typescript
    import { useQueryClient } from "@tanstack/vue-query";
    const queryClient = useQueryClient();

    // Invalidate all queries under the 'projects' router
    queryClient.invalidateQueries({ queryKey: orpc.projects.key() });
    ```

- Avoid manual loading and error handling - let TanStack Query handle these states.
- For documentation, use Context7 with library ID `tanstack/query`.

**TanStack Form for Vue Integration:**

- For all forms, we use `@tanstack/vue-form` to manage form state, validation, and submission.
- Validation is handled by `zod`. The schema should be defined and used within the `useForm` hook.
- **Golden Rule:** Always use the `useForm` hook to initialize and manage your form. Bind fields using the `form.Field` component and handle submission via the `onSubmit` option in `useForm`.
  - **Form Setup:** Initialize the form with `useForm`, providing `defaultValues`, a `zod` schema for validation, and an `onSubmit` handler.

    ```typescript
    import { useForm } from "@tanstack/vue-form";
    import { z } from "zod";
    import { orpc } from "~/lib/orpc";
    import { useMutation } from "@tanstack/vue-query";

    const ProjectSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
    });

    const { mutate: createProject } = useMutation(...);

    const form = useForm({
      defaultValues: {
        title: "",
        description: "",
      },
      validators: {
        onChange: ProjectSchema,
      },
      onSubmit: async ({ value }) => {
        createProject(value);
      },
    });
    ```

  - **Template Binding:** Use the `form.Field` component to bind inputs and display validation errors.
    ```vue
    <form @submit.prevent="form.handleSubmit">
      <form.Field name="title">
        <template v-slot="{ field, state }">
          <label for="title">Title</label>
          <Input
            id="title"
            :model-value="field.state.value"
            @update:model-value="(value) => field.handleChange(String(value))"
            @blur="field.handleBlur"
          />
          <p v-if="state.meta.errors.length">{{ state.meta.errors[0]?.message }}</p>
        </template>
      </form.Field>
      <Button type="submit">Create</Button>
    </form>
    ```

- For documentation, use Context7 with library ID `tanstack/form`.

## 4. Tool Usage Conventions

- **Node.js Package Manager:** Always use `bun` instead of `npm` for all Node.js related operations (e.g., `bun install`, `bun run`, `bun test`).
- **Executing Binaries:** Use `bunx` instead of `npx`.
- **Global Package Installation:** Use `bun add -g <package-name>`.
- **Git Commits:** To commit changes using Git, use the `ac` command. This command does not accept any arguments; the commit message is automatically generated by the system. To commit and push changes to main branch, use `acp` instead.

## Error Handling in oRPC

oRPC's type safety for errors relies on a **declarative-first** approach. To ensure the client receives correct and strong types for errors, you **must** declare them in the backend router.

### The Golden Rule: Declare Your Errors

All common, reusable errors should be defined in a `base` procedure using the `.errors()` method. This includes both custom application errors (`NOT_FOUND`) and default oRPC errors (`BAD_REQUEST`).

**File: `packages/backend/src/routes/base.ts`**

```typescript
import { os } from "@orpc/server";
import { z, type ZodError } from "zod";

export const base = os.errors({
  // Contract for automatic Zod validation errors
  BAD_REQUEST: {
    data: z.object({
      issues: z.custom<ZodError["issues"]>(),
    }),
  },
  // Custom application errors
  NOT_FOUND: {
    message: "The requested resource could not be found.",
  },
  UNAUTHORIZED: {
    message: "You are not authorized to perform this action.",
  },
});
```

### Throwing Errors in Procedures

Once defined in the `base` procedure, you can throw these errors in a type-safe way from any handler that is built from `base`.

- **Do not use `try-catch` blocks for unexpected errors.** Let oRPC handle them; they will be converted to a generic `INTERNAL_SERVER_ERROR`.
- **Use the `errors` object from the handler context** to throw declared, type-safe errors.

**Good Example (Type-Safe Approach):**

```typescript
import { base } from "./base";

export const getProject = base
  .input(...)
  .handler(async ({ input, errors }) => { // `errors` is available
    const project = await db.findProject(input.id);
    if (!project) {
      // This is fully type-safe. The client will know the code is 'NOT_FOUND'.
      throw errors.NOT_FOUND({
        message: `Project with id ${input.id} not found`,
      });
    }
    return project;
  });
```

### Handling Errors on the Client

On the client, use the `isDefinedError` type guard to safely access error properties. Because the backend contract is now correctly defined, TypeScript will have full type information on the `error.data` payload.

```vue
<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { orpc } from "~/lib/orpc";
import { isDefinedError } from "@orpc/client";

const { error } = useQuery(orpc.dummy.get.queryOptions(...));

watch(error, () => {
  if (isDefinedError(error.value) && error.value.code === "BAD_REQUEST") {
    // `error.value.data` is now fully typed!
    const firstIssue = error.value.data.issues;
    console.log(firstIssue?.message);
  }
});
</script>
```

### # Task Master AI - Agent Integration Guide

## Essential Commands

### Core Workflow Commands

```bash
# Project Setup
task-master init                                    # Initialize Task Master in current project
task-master parse-prd .taskmaster/docs/prd.txt      # Generate tasks from PRD document
task-master models --setup                        # Configure AI models interactively

# Daily Development Workflow
task-master list                                   # Show all tasks with status
task-master next                                   # Get next available task to work on
task-master show <id>                             # View detailed task information (e.g., task-master show 1.2)
task-master set-status --id=<id> --status=done    # Mark task complete

# Task Management
task-master add-task --prompt="description" --research        # Add new task with AI assistance
task-master expand --id=<id> --research --force              # Break task into subtasks
task-master update-task --id=<id> --prompt="changes"         # Update specific task
task-master update --from=<id> --prompt="changes"            # Update multiple tasks from ID onwards
task-master update-subtask --id=<id> --prompt="notes"        # Add implementation notes to subtask

# Analysis & Planning
task-master analyze-complexity --research          # Analyze task complexity
task-master complexity-report                      # View complexity analysis
task-master expand --all --research               # Expand all eligible tasks

# Dependencies & Organization
task-master add-dependency --id=<id> --depends-on=<id>       # Add task dependency
task-master move --from=<id> --to=<id>                       # Reorganize task hierarchy
task-master validate-dependencies                            # Check for dependency issues
task-master generate                                         # Update task markdown files (usually auto-called)
```

## Key Files & Project Structure

### Core Files

- `.taskmaster/tasks/tasks.json` - Main task data file (auto-managed)
- `.taskmaster/config.json` - AI model configuration (use `task-master models` to modify)
- `.taskmaster/docs/prd.txt` - Product Requirements Document for parsing
- `.taskmaster/tasks/*.txt` - Individual task files (auto-generated from tasks.json)
- `.env` - API keys for CLI usage

### Claude Code Integration Files

- `CLAUDE.md` - Auto-loaded context for Claude Code (this file)
- `.claude/settings.json` - Claude Code tool allowlist and preferences
- `.claude/commands/` - Custom slash commands for repeated workflows
- `.mcp.json` - MCP server configuration (project-specific)

### Directory Structure

```
project/
├── .taskmaster/
│   ├── tasks/              # Task files directory
│   │   ├── tasks.json      # Main task database
│   │   ├── task-1.md      # Individual task files
│   │   └── task-2.md
│   ├── docs/              # Documentation directory
│   │   ├── prd.txt        # Product requirements
│   ├── reports/           # Analysis reports directory
│   │   └── task-complexity-report.json
│   ├── templates/         # Template files
│   │   └── example_prd.txt  # Example PRD template
│   └── config.json        # AI models & settings
├── .claude/
│   ├── settings.json      # Claude Code configuration
│   └── commands/         # Custom slash commands
├── .env                  # API keys
├── .mcp.json            # MCP configuration
└── CLAUDE.md            # This file - auto-loaded by Claude Code
```

## MCP Integration

Task Master provides an MCP server that Claude Code can connect to. Configure in `.mcp.json`:

```json
{
  "mcpServers": {
    "task-master-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your_key_here",
        "PERPLEXITY_API_KEY": "your_key_here",
        "OPENAI_API_KEY": "OPENAI_API_KEY_HERE",
        "GOOGLE_API_KEY": "GOOGLE_API_KEY_HERE",
        "XAI_API_KEY": "XAI_API_KEY_HERE",
        "OPENROUTER_API_KEY": "OPENROUTER_API_KEY_HERE",
        "MISTRAL_API_KEY": "MISTRAL_API_KEY_HERE",
        "AZURE_OPENAI_API_KEY": "AZURE_OPENAI_API_KEY_HERE",
        "OLLAMA_API_KEY": "OLLAMA_API_KEY_HERE"
      }
    }
  }
}
```

### Essential MCP Tools

```javascript
help; // = shows available taskmaster commands
// Project setup
initialize_project; // = task-master init
parse_prd; // = task-master parse-prd

// Daily workflow
get_tasks; // = task-master list
next_task; // = task-master next
get_task; // = task-master show <id>
set_task_status; // = task-master set-status

// Task management
add_task; // = task-master add-task
expand_task; // = task-master expand
update_task; // = task-master update-task
update_subtask; // = task-master update-subtask
update; // = task-master update

// Analysis
analyze_project_complexity; // = task-master analyze-complexity
complexity_report; // = task-master complexity-report
```

## Claude Code Workflow Integration

### Standard Development Workflow

#### 1. Project Initialization

```bash
# Initialize Task Master
task-master init

# Create or obtain PRD, then parse it
task-master parse-prd .taskmaster/docs/prd.txt

# Analyze complexity and expand tasks
task-master analyze-complexity --research
task-master expand --all --research
```

If tasks already exist, another PRD can be parsed (with new information only!) using parse-prd with --append flag. This will add the generated tasks to the existing list of tasks..

#### 2. Daily Development Loop

```bash
# Start each session
task-master next                           # Find next available task
task-master show <id>                     # Review task details

# During implementation, check in code context into the tasks and subtasks
task-master update-subtask --id=<id> --prompt="implementation notes..."

# Complete tasks
task-master set-status --id=<id> --status=done
```

#### 3. Multi-Claude Workflows

For complex projects, use multiple Claude Code sessions:

```bash
# Terminal 1: Main implementation
cd project && claude

# Terminal 2: Testing and validation
cd project-test-worktree && claude

# Terminal 3: Documentation updates
cd project-docs-worktree && claude
```

### Custom Slash Commands

Create `.claude/commands/taskmaster-next.md`:

```markdown
Find the next available Task Master task and show its details.

Steps:

1. Run `task-master next` to get the next task
2. If a task is available, run `task-master show <id>` for full details
3. Provide a summary of what needs to be implemented
4. Suggest the first implementation step
```

Create `.claude/commands/taskmaster-complete.md`:

```markdown
Complete a Task Master task: $ARGUMENTS

Steps:

1. Review the current task with `task-master show $ARGUMENTS`
2. Verify all implementation is complete
3. Run any tests related to this task
4. Mark as complete: `task-master set-status --id=$ARGUMENTS --status=done`
5. Show the next available task with `task-master next`
```

## Tool Allowlist Recommendations

Add to `.claude/settings.json`:

```json
{
  "allowedTools": [
    "Edit",
    "Bash(task-master *)",
    "Bash(git commit:*)",
    "Bash(git add:*)",
    "Bash(npm run *)",
    "mcp__task_master_ai__*"
  ]
}
```

## Configuration & Setup

### API Keys Required

At least **one** of these API keys must be configured:

- `ANTHROPIC_API_KEY` (Claude models) - **Recommended**
- `PERPLEXITY_API_KEY` (Research features) - **Highly recommended**
- `OPENAI_API_KEY` (GPT models)
- `GOOGLE_API_KEY` (Gemini models)
- `MISTRAL_API_KEY` (Mistral models)
- `OPENROUTER_API_KEY` (Multiple models)
- `XAI_API_KEY` (Grok models)

An API key is required for any provider used across any of the 3 roles defined in the `models` command.

### Model Configuration

```bash
# Interactive setup (recommended)
task-master models --setup

# Set specific models
task-master models --set-main claude-3-5-sonnet-20241022
task-master models --set-research perplexity-llama-3.1-sonar-large-128k-online
task-master models --set-fallback gpt-4o-mini
```

## Task Structure & IDs

### Task ID Format

- Main tasks: `1`, `2`, `3`, etc.
- Subtasks: `1.1`, `1.2`, `2.1`, etc.
- Sub-subtasks: `1.1.1`, `1.1.2`, etc.

### Task Status Values

- `pending` - Ready to work on
- `in-progress` - Currently being worked on
- `done` - Completed and verified
- `deferred` - Postponed
- `cancelled` - No longer needed
- `blocked` - Waiting on external factors

### Task Fields

```json
{
  "id": "1.2",
  "title": "Implement user authentication",
  "description": "Set up JWT-based auth system",
  "status": "pending",
  "priority": "high",
  "dependencies": ["1.1"],
  "details": "Use bcrypt for hashing, JWT for tokens...",
  "testStrategy": "Unit tests for auth functions, integration tests for login flow",
  "subtasks": []
}
```

## Claude Code Best Practices with Task Master

### Context Management

- Use `/clear` between different tasks to maintain focus
- This CLAUDE.md file is automatically loaded for context
- Use `task-master show <id>` to pull specific task context when needed

### Iterative Implementation

1. `task-master show <subtask-id>` - Understand requirements
2. Explore codebase and plan implementation
3. `task-master update-subtask --id=<id> --prompt="detailed plan"` - Log plan
4. `task-master set-status --id=<id> --status=in-progress` - Start work
5. Implement code following logged plan
6. `task-master update-subtask --id=<id> --prompt="what worked/didn't work"` - Log progress
7. `task-master set-status --id=<id> --status=done` - Complete task

### Complex Workflows with Checklists

For large migrations or multi-step processes:

1. Create a markdown PRD file describing the new changes: `touch task-migration-checklist.md` (prds can be .txt or .md)
2. Use Taskmaster to parse the new prd with `task-master parse-prd --append` (also available in MCP)
3. Use Taskmaster to expand the newly generated tasks into subtasks. Consdier using `analyze-complexity` with the correct --to and --from IDs (the new ids) to identify the ideal subtask amounts for each task. Then expand them.
4. Work through items systematically, checking them off as completed
5. Use `task-master update-subtask` to log progress on each task/subtask and/or updating/researching them before/during implementation if getting stuck

### Git Integration

Task Master works well with `gh` CLI:

```bash
# Create PR for completed task
gh pr create --title "Complete task 1.2: User authentication" --body "Implements JWT auth system as specified in task 1.2"

# Reference task in commits
git commit -m "feat: implement JWT auth (task 1.2)"
```

### Parallel Development with Git Worktrees

```bash
# Create worktrees for parallel task development
git worktree add ../project-auth feature/auth-system
git worktree add ../project-api feature/api-refactor

# Run Claude Code in each worktree
cd ../project-auth && claude    # Terminal 1: Auth work
cd ../project-api && claude     # Terminal 2: API work
```

## Troubleshooting

### AI Commands Failing

```bash
# Check API keys are configured
cat .env                           # For CLI usage

# Verify model configuration
task-master models

# Test with different model
task-master models --set-fallback gpt-4o-mini
```

### MCP Connection Issues

- Check `.mcp.json` configuration
- Verify Node.js installation
- Use `--mcp-debug` flag when starting Claude Code
- Use CLI as fallback if MCP unavailable

### Task File Sync Issues

```bash
# Regenerate task files from tasks.json
task-master generate

# Fix dependency issues
task-master fix-dependencies
```

DO NOT RE-INITIALIZE. That will not do anything beyond re-adding the same Taskmaster core files.

## Important Notes

### AI-Powered Operations

These commands make AI calls and may take up to a minute:

- `parse_prd` / `task-master parse-prd`
- `analyze_project_complexity` / `task-master analyze-complexity`
- `expand_task` / `task-master expand`
- `expand_all` / `task-master expand --all`
- `add_task` / `task-master add-task`
- `update` / `task-master update`
- `update_task` / `task-master update-task`
- `update_subtask` / `task-master update-subtask`

### File Management

- Never manually edit `tasks.json` - use commands instead
- Never manually edit `.taskmaster/config.json` - use `task-master models`
- Task markdown files in `tasks/` are auto-generated
- Run `task-master generate` after manual changes to tasks.json

### Claude Code Session Management

- Use `/clear` frequently to maintain focused context
- Create custom slash commands for repeated Task Master workflows
- Configure tool allowlist to streamline permissions
- Use headless mode for automation: `claude -p "task-master next"`

### Multi-Task Updates

- Use `update --from=<id>` to update multiple future tasks
- Use `update-task --id=<id>` for single task updates
- Use `update-subtask --id=<id>` for implementation logging

### Research Mode

- Add `--research` flag for research-based AI enhancement
- Requires a research model API key like Perplexity (`PERPLEXITY_API_KEY`) in environment
- Provides more informed task creation and updates
- Recommended for complex technical tasks

---

_This guide ensures Claude Code has immediate access to Task Master's essential functionality for agentic development workflows._
