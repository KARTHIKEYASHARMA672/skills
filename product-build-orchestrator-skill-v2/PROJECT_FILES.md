# Project File Reference

## Core documents for substantial projects

- `PRD.md` — product requirements and acceptance criteria
- `ARCHITECTURE.md` — technical structure and diagrams
- `RULES.md` — project rules and definition of done
- `DESIGN.md` — visual and interaction specification
- `MEMORY.md` — durable project context and current state
- `PHASES.md` — staged implementation plan

## Recommended supporting files

- `AGENTS.md` or the host's supported instruction file
- `CONTRIBUTING.md`
- `TESTING.md`
- `SECURITY.md`
- `CHANGELOG.md`
- `TASKS.md`
- `DECISIONS.md`
- `OBSERVABILITY.md` (especially for deployed services)

## Configuration files, only when relevant to the actual stack

- `.gitignore`
- `.env.example`
- Dependency manifest and matching lockfile
- Type checking, linting, and formatting configuration
- CI workflow such as `.github/workflows/ci.yml`
- `Makefile` or `justfile`
- `Dockerfile` and `compose.yaml`
- Tool/editor-specific configuration

## Conditional product files

- `API.md` or `openapi.yaml` — meaningful HTTP API
- `DATABASE.md` — non-trivial data model or migrations
- `AI.md` or `PROMPTS.md` — AI models, prompts, tools, retrieval, safeguards
- `AGENT_ROLES.md` — multi-agent workflow
- `RUNBOOK.md` — deployed/operational service
- `EVALUATION.md` — AI evaluation or quality benchmarks
- `ACCESSIBILITY.md`, `PERFORMANCE.md`, `RELEASE.md`, `DATA_GOVERNANCE.md` — only when a dedicated document is useful

Do not create empty placeholders or duplicate an existing source of truth. Tiny one-off changes may not need all documentation.
