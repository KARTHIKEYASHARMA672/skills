# Product Build Orchestrator

A portable skill for AI coding agents to plan and build software with clear requirements, architecture, design, rules, memory, phases, supporting documentation, and verification.

## Included

- `SKILL.md` — full reusable skill instructions
- `README.md` — installation and usage notes
- `PROJECT_FILES.md` — quick reference for mandatory, recommended, and conditional project files

## Install

1. Extract the ZIP.
2. Copy the skill folder to the custom-skill location supported by your agent, or use `SKILL.md` in the location that agent supports.
3. For repository-level use, add a short pointer from the host's supported instruction file (such as `AGENTS.md`, `CLAUDE.md`, or an equivalent) telling the agent to follow this skill.
4. On a new substantial project, ask the agent to inspect the repository, initialize the documentation, validate consistency, and then implement phase by phase.

The exact installation path differs by tool. Do not assume all agents automatically discover the same skill directory or instruction filename.

## Important behavior

The skill requires six core documents for substantial projects and recommends supporting files. It creates stack-specific and product-specific files only when relevant, to avoid unnecessary paperwork and conflicting configuration.
