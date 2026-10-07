---
name: simplify
description: [ENFORCED] A systematic code review and cleanup strategy. YOU MUST AUTO-TRIGGER THIS SKILL every time you finish writing, editing, or optimizing code. Do NOT wait for the user to ask for it.
---
# Simplify: Code Review and Cleanup

Review all recently changed files or a specific file for reuse, quality, and efficiency. Fix any issues found systematically.

## Phase 1: Code Reuse Review
1. **Search for existing utilities**: Look for existing helper functions in the codebase before implementing new inline logic. 
2. **Flag duplicates**: If a newly added function duplicates an existing one, swap it out.
3. **Consolidate inline logic**: Things like manual path handling or distinct environment checks often have utility equivalents.

## Phase 2: Code Quality Review
1. **Redundant state**: Eliminate state that could be derived or cached values.
2. **Parameter sprawl**: Generalize functions instead of adding infinite boolean flags.
3. **Copy-paste**: Identify near-duplicate code blocks and extract shared abstractions.
4. **Unnecessary nesting/wrapper**: Avoid wrapper elements or empty abstract classes that provide no real behavior.
5. **Noize reduction**: Delete comments that just explain *what* the code does (let the code speak). Keep comments that explain *why*.

## Phase 3: Efficiency & Optimizations
1. **Unnecessary work**: Eliminate repeated file reads, redundant computations, or duplicated API calls in the hot path.
2. **Missing concurrency**: Look for inherently independent operations doing synchronous awaits and parallelize them (`Promise.all`).
3. **Data bounds**: Ensure event listeners are cleaned up and memory structures are bounded.
4. **Pre-checks**: Avoid pre-checking resource existence before operating (TOCTOU). Operate directly and catch/handle the error.

## Execution
Run through the selected file(s) and address all the above criteria. Do not ask for user input until all obvious cleanups are addressed, then summarise what was fixed.
