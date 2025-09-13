---
description: Run TypeScript type checking with smart package filtering
agent: build
model: google/gemini-2.0-flash
---

Run comprehensive TypeScript type checking on the project. Supports intelligent package filtering with natural language arguments.

**Usage Examples:**

- `/typecheck` - Check all packages
- `/typecheck all` - Check all packages explicitly
- `/typecheck backend` - Check packages containing "backend"
- `/typecheck client api` - Check packages containing "client" or "api"
- `/typecheck packages starting with a` - Check packages that start with "a"

## Arguments Analysis

Target packages based on: "$ARGUMENTS"

## Project Analysis (if not already known from context)

`!find . -name "package.json" -not -path "*/node_modules/*" -exec dirname {} \; | sort`

## Execute TypeCheck

For each target package:

1.  **Find the Typecheck Script**: Look inside the package's `package.json` for a script with a name like `typecheck`, `type-check`, `tsc`, `tsc:check`, or `check-types`.
2.  **Execute the Script by NAME**: Run the script you found using its **name**. For example, if you find `"typecheck": "nuxi typecheck"`, you must run the script named `typecheck`.
3.  **Parse and explain errors** in clear, understandable language, including code snippets.

## Monorepo Execution Strategy

**CRITICAL: HOW TO RUN THE COMMAND**

To execute the script, you run its **NAME**, not its content.

**Correct Example:**
If `packages/client/package.json` contains `"scripts": { "typecheck": "nuxi typecheck" }`, the command to run is:

```bash
bun --cwd packages/client typecheck
```

**Incorrect Example:**
Do NOT run the content of the script. This is wrong:

```bash
# INCORRECT COMMAND - DO NOT DO THIS
bun --cwd packages/client nuxi typecheck
```

This ensures:

- Dependencies resolve correctly from the package's node_modules.
- TypeScript configs are read from the right location.
- Relative paths in tsconfig.json work properly.
- Package-specific settings are respected.

Also, note that when using `bun --cwd`, the `run` keyword is omitted. It's `bun --cwd path/to/package <script-name>`, not `bun --cwd path/to/package run <script-name>`.

## Error Analysis Instructions

When reporting errors, your primary goal is to explain **what's wrong** and **where**. For each significant error, you MUST provide a relevant code snippet with a comment explaining the issue directly in the code.

**Good Example:**

Here's a breakdown of the TypeScript errors found:

In `src/bad_code.ts`:

```typescript
// src/bad_code.ts:3
// TypeScript Error: The variable 'num' is expected to be a 'string', but it's being assigned a 'number'.
let num: string = 123;
```

```typescript
// src/bad_code.ts:16
const person: Person = {
  name: "Orenji",
  // TypeScript Error: The 'age' property is defined as a 'number', but it's being assigned a 'string'.
  age: "30",
};
```

```typescript
// src/bad_code.ts:28
  getValue(): string {
    // TypeScript Error: This method is supposed to return a 'string', but 'this.value' is a 'number'.
    return this.value;
  }
```

```typescript
// src/bad_code.ts:41
// TypeScript Error: You're trying to assign the string "Purple" to the variable 'color', but "Purple" is not a valid member of the 'Colors' enum.
let color: Colors = "Purple";
```

**Key Formatting Rules:**

- For each error, create a separate markdown code block.
- Start the block with a comment indicating the file and line number (`// path/to/file.ts:LINE`).
- Add a comment (`// TypeScript Error: ...`) on the line directly preceding the error to explain what is wrong in simple terms.
- Include only the line with the error and a few lines of surrounding context if necessary.

**Don't Include:**

- Error counts and statistics.
- Generic categorization like "Cannot find module: 25 errors".
- Fix suggestions or "how to resolve" sections.
- Boilerplate summaries with numbers.

## Execution Plan

**Step 1**: Parse arguments to determine target packages using natural language understanding.
**Step 2**: For each target package, find its `package.json` and identify the name of the type checking script (e.g., `typecheck`, `tsc`).
**Step 3**: Execute the script **by its name** using the format `bun --cwd path/to/package <script-name>`.
**Step 4**: For each error, explain the issue with a commented code snippet as described in the Error Analysis Instructions.
**Step 5**: Group related errors by file when appropriate.

Execute typecheck now based on the specified criteria, ensuring proper working directory handling for monorepo packages.
