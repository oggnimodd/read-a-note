# The Prompt Dojo: A Deep Dive into Our Data Philosophy

This document explores the architecture behind our prompt engineering platform. We'll break down the "why" of our data structures and walk through a detailed simulation of how the application brings them to life, enabling powerful and flexible prompt evaluation.

---

## Part 1: The Core Philosophy - Flexibility is King

Our entire system is built on a simple but powerful idea: **A prompt is a living entity, and its tests should be able to evolve with it.**

- **Test Cases are for Prompts, Not Versions:** A test case (e.g., testing with a user named "John") isn't rigidly tied to a single version of a prompt. It's part of a larger test suite for the _master prompt_ itself. This lets us build a comprehensive set of tests that can be used over and over.

- **Effortless Regression Testing:** The primary goal is to answer the question: "Did my recent change make this prompt better or worse?" Our structure makes this easy by allowing you to run the same test suite against any version of a prompt—new or old.

- **Embrace Variable Mismatch:** We accept that variables in a prompt template will change. A `{{user}}` variable might become `{{first_name}}`. Our system doesn't crash or complain. It intelligently uses the data it can and ignores what it can't. This is why we store test case inputs in a flexible JSON format; the database schema doesn't care about the variables, only the application logic does.

---

## Part 2: The Building Blocks - Our Data Structures & Their Reasoning

Let's look at the key tables in our database and, more importantly, the reasoning behind their design.

### The `prompts` Table

Think of this as the **master record** for a creative idea. It's a simple container holding a title and linking to a project. It doesn't contain the prompt text itself—that's handled by versions.

- **Reasoning:** Separating the "idea" of a prompt from its content (the template) allows us to attach things like test cases to the overarching concept rather than a specific iteration.

### The `prompt_versions` Table

This is where the history lives. Every time you save a change to a prompt, you create a new **`PromptVersion`**. This is like a commit in Git. It captures the prompt's `template` text at a specific point in time.

- **Reasoning:** An immutable history is the cornerstone of good evaluation. By never overwriting a previous version, we ensure that we can always go back in time to see exactly what a prompt looked like and reproduce its results.

### The `test_cases` Table

This is your arsenal of tests. Each test case belongs to a master `prompt` and contains a flexible `input` JSON object.

- **Reasoning for `prompt_id`:** As stated in our core philosophy, linking test cases to the parent `prompt` is what enables reusability and powerful regression testing. It decouples the test inputs from any single implementation of the prompt's template.
- **Reasoning for `input` as JSON:** We use a flexible JSON blob for inputs because the variables in a prompt template are not static. If we created a rigid schema with columns for `user`, `store_name`, etc., we would be forced to run a database migration every time we wanted to add, remove, or rename a variable. This would be incredibly slow and brittle. A JSON blob gives us ultimate flexibility to adapt.

---

## Part 3: Bringing It to Life - A Simulation

(This section remains the same as before, walking through the variable replacement logic.)

---

## Part 4: The Evaluation Lifecycle & UI Design

This section addresses questions about saving results, comparing them, and how the user would interact with it all.

### 4.1. Storing the Results: The `evaluations` Table

Yes, we absolutely save the results of every execution. This is our lab notebook, providing a permanent record of every experiment. We use the `evaluations` table for this.

- **The Concept:** Every time a `test_case` is run against a specific `prompt_version`, a new row is created in this table. This gives us a precise record linking an input to a template version and its resulting output.
- **Reasoning:** The combination of `test_case_id` and `prompt_version_id` serves as the unique identifier for a single, reproducible experiment. This allows us to cache and display results without needing to re-run tests constantly, while also providing a clear historical log of what was tested.

### 4.2. The User Experience: Designing the Evaluation Workbench

On the prompt details page, below the header with the "Edit Prompt" button, we will have the **Evaluation Workbench**. This is the interactive heart of the feature.

### 4.3. Detailed UI Mockup & Rerun Logic

Let's visualize the comparison view and explain the logic for running and rerunning tests.

**The UI Mockup (when comparing Latest (v3) vs. Version 2):**

```markdown
## Evaluation Workbench

| Base Version: [ Latest (v3) ▼] | Compare With: [ Version 2 ▼] | [ 🚀 Run All Tests ▼ ] |
| :----------------------------- | :--------------------------- | :--------------------- |

---

### Test Results

| Test Case         | Output (Latest - v3)                                       | Output (Version 2)                                                  | Diff & Actions           |
| :---------------- | :--------------------------------------------------------- | :------------------------------------------------------------------ | :----------------------- |
| **Standard User** | `Hi John, welcome to MegaMart! We're glad you're here.`    | `Hi John, welcome to MegaMart! Thanks for being a valued customer.` | `[View Diff]` `[Re-run]` |
| **Power User**    | `Hi Jane, welcome to ElectroZone! We're glad you're here.` | `[Not yet run]` `[Run]`                                             | `[Re-run]`               |
| **New Edge Case** | `[Not yet run]` `[Run]`                                    | `[Not yet run]` `[Run]`                                             | `[Re-run]`               |
```

### 4.4. The "Why" Behind the UI Design

Every element of the UI is deliberately designed to support the workflow of a prompt engineer.

- **Why two separate version dropdowns?**
  Separating the **"Base"** and **"Compare"** versions creates a clear mental model for the user: "I am comparing this version _against_ that version." It is more intuitive and less error-prone than a multi-select list, establishing a clear baseline for every comparison.

- **Why does "Run All" not overwrite existing results by default?**
  This design choice respects the user's time and potential API costs. The most common action is to fill in the blanks for tests that haven't been run yet. The default behavior is therefore efficient and non-destructive. We provide a **"Force re-run all tests"** option in a dropdown for when a complete, clean-slate re-evaluation is explicitly needed. This gives the user power while ensuring the default action is safe.

- **Why a dedicated `[View Diff]` button?**
  Simply placing two blocks of text side-by-side is not enough to spot subtle but critical changes. A visual, color-coded diff view (like on GitHub) is the fastest and most effective way for a human to instantly see what changed—whether it's a single word, punctuation, a change in tone, or the entire structure of the response. This is the most valuable piece of the comparison puzzle.

- **Why does a re-run _replace_ the previous result?**
  As discussed, this keeps the primary UI clean and focused. The history that matters most is the versioning of the prompt templates themselves. For any given version, the user is most concerned with its _current_ performance against a test case, not its performance three runs ago. This avoids UI clutter and keeps the data model simple, focusing on the core task of comparing prompt versions.
