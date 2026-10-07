---
name: systematic-debug
description: [ENFORCED] A powerful, structured debugging workflow. YOU MUST AUTO-TRIGGER THIS SKILL every time you encounter an error, bug, or failure instead of blindly guessing fixes. Do NOT wait for the user to ask for it.
---

# Systematic Debugging

When encountering errors, crashes, or unintended behaviors, do not guess at the solution. Run through these methodical steps to establish facts and trace the issue before proposing any file edits.

## 1. Reproduce and Isolate
1. **Understand exactly what is failing:** Is it a build error, a runtime crash, a UI glitch, or a stalled process? Get the exact error message via `run_command` if possible.
2. **Find the reproduction path:** What command or action triggers the error?

## 2. Fact-Gathering (No guessing allowed)
1. **Read the logs/stack trace:** Identify the file and line number where the explosion happened.
2. **Inspect the context:** Use `view_file` to look at the exact line of failure and the surrounding function. *Do not assume the code structure based on the file name.*
3. **Trace the inputs:** Where does the failing data come from? Grep for the callers of the failing function and inspect the arguments they pass.
4. **Identify assumptions:** What does this code assume to be true? (e.g. "This object is never null", "The database connection is active", "This file exists").

## 3. Formulate and Test Hypotheses
1. Based on your isolated facts, list 1-3 distinct hypotheses for what broke.
2. **Verify hypotheses without editing:** Run `console.log` injections or temporary test scripts to confirm if your hypothesis is correct. Only propose an edit to the main file once a hypothesis has been confirmed via facts.

## 4. Implementation and Cleanup
1. Write the minimal fix to resolve the bug, following existing codebase patterns.
2. Explain the root cause clearly and concisely to the user, and verify the fix solves the issue.
