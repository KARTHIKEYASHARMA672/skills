---
name: architect
description: [ENFORCED] A systemic approach for planning out large, complex changes or refactors prior to writing any code. YOU MUST AUTO-TRIGGER THIS SKILL if a user request involves more than 2 files or complex system boundaries.
---

# Architect Workflow

When the requested change spans multiple files, requires new abstractions, or involves complex logic, use this workflow to architect the solution first, preventing haphazard, buggy edits.

## Phase 1: Context Gathering
1. Do NOT write any code yet. 
2. Use `grep_search` and `view_file` to find all call sites, dependencies, and relevant logic that the change will affect.
3. Understand the architectural conventions of the current workspace (e.g., Do they use dependency injection? React Context? How are errors handled?).

## Phase 2: Design & Decomposition
1. Create a `planning_document.md` artifact (or update an existing `implementation_plan.md`) describing the architecture of your solution.
2. If refactoring, list out the discrete, isolated steps you will take to migrate the code. Each step should be mergeable and testable on its own without breaking the build.
3. Explicitly define what data types, interfaces, or classes will need to change.
4. Detail the testing/verification strategy.

## Phase 3: Review and Execute
1. Pause and present the drafted architecture to the user. Ask them to confirm if the strategy aligns with their vision.
2. Once the user approves, execute the plan one step at a time, testing at each boundary. If a step fails verification, rollback the step, modify the plan in the artifact, and explain the pivot.
