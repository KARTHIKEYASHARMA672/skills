# 🧠 Agent Core Skills Library (`KARTHIKEYASHARMA672/skills`)

> **Production-grade, battle-tested skill library for autonomous AI coding agents (Antigravity, Claude Code, Codex, Cursor, and custom agent runtimes). Curated, audited, and strictly secret-free.**

---

### 📋 Metadata & Repository Information

| Property | Value |
| :--- | :--- |
| **Repository** | [`KARTHIKEYASHARMA672/skills`](https://github.com/KARTHIKEYASHARMA672/skills) |
| **Total Core Skills** | **51 Production Skills** |
| **Tier Classification** | **Tier 1: Active Session Skills** (Primary Agent Capabilities) |
| **Local Mirror Targets** | `C:\Users\karth\.gemini\config\skills\` & `L:\skills\` |
| **Author / Maintainer** | [KARTHIKEYASHARMA672](https://github.com/KARTHIKEYASHARMA672) |
| **Verification Status** | 🟢 **100% Secret-Free, Validated YAML Frontmatter, Clean Syntax** |
| **Companion Repos** | [`KARTHIKEYASHARMA672/new-skills`](https://github.com/KARTHIKEYASHARMA672/new-skills) (521 curated skills) · [`KARTHIKEYASHARMA672/claude-skills`](https://github.com/KARTHIKEYASHARMA672/claude-skills) (90 Claude skills) |

---

## 📑 Table of Contents

- [1. Skills Ecosystem Architecture](#1-skills-ecosystem-architecture)
- [2. Complete Skills Catalog (51 Skills)](#2-complete-skills-catalog-51-skills)
- [3. Category Breakdown & Deep-Dives](#3-category-breakdown--deep-dives)
  - [3.1 Architecture, Governance & Orchestration](#31-architecture-governance--orchestration)
  - [3.2 Frontend Design, 3D WebGL & Aesthetics](#32-frontend-design-3d-webgl--aesthetics)
  - [3.3 Video, Media & Creative Engineering](#33-video-media--creative-engineering)
  - [3.4 Backend, Distributed Systems & Database Architecture](#34-backend-distributed-systems--database-architecture)
  - [3.5 Language Pro Specialists & Framework Best Practices](#35-language-pro-specialists--framework-best-practices)
  - [3.6 Debugging, Testing, Audit & Performance](#36-debugging-testing-audit--performance)
- [4. Installation & Agent Integration](#4-installation--agent-integration)
- [5. Quality & Security Guarantees](#5-quality--security-guarantees)

---

## 1. 🌐 Skills Ecosystem Architecture

This repository forms **Tier 1** of the three-tier agent knowledge architecture maintained by KARTHIKEYASHARMA672:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THREE-TIER AGENT SKILLS ECOSYSTEM                    │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌─────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────┐
│ Tier 1: Active Core     │   │ Tier 2: Offline Curated │   │ Tier 3: Claude Skills   │
│ KARTHIKEYASHARMA672/    │   │ KARTHIKEYASHARMA672/    │   │ KARTHIKEYASHARMA672/    │
│ skills                  │   │ new-skills              │   │ claude-skills           │
├─────────────────────────┤   ├─────────────────────────┤   ├─────────────────────────┤
│ 51 Core Skills          │   │ 521 Specialized Skills  │   │ 90 Multi-Modal Packs    │
│ Active session memory,  │   │ 11 domain categories,   │   │ Plugins, examples, and  │
│ enforced workflows,     │   │ deep pipelines, offline │   │ office document tools   │
│ architecture, and tools │   │ research & scaffolding  │   │ (docx, pptx, xlsx, pdf) │
└─────────────────────────┘   └─────────────────────────┘   └─────────────────────────┘
```

---

## 2. 📚 Complete Skills Catalog (51 Skills)

| # | Skill Name | Primary Role & Domain | Enforced / Trigger Condition |
| :--- | :--- | :--- | :--- |
| **1** | `animate-skill` | Motion & Transition Patterns | Next.js/React animations, Framer Motion, easing curves |
| **2** | `api-design-principles` | REST & GraphQL Architecture | API contracts, schema design, HTTP semantics |
| **3** | `architect` | Pre-Implementation System Design | **[ENFORCED]** Multi-file edits (>2 files), major refactors |
| **4** | `brainstorming` | Idea Validation & Design Refinement | Creative ideation, architecture alternatives, tradeoff analysis |
| **5** | `caching-patterns` | Advanced Caching & Invalidation | Redis cache-aside, CDN caching, stampede protection, TTL |
| **6** | `caching-strategy` | Multi-Level Cache Orchestration | HTTP caching headers, multi-tier cache decorators, invalidation |
| **7** | `colours for websites` | Jewel-Tone & Neutral Color Palettes | UI color systems, CSS/Tailwind design tokens, theme palettes |
| **8** | `cpp-pro` | Modern C++20/23 Idiomatic Code | RAII, smart pointers, templates, move semantics, STL |
| **9** | `create-pr` | GitHub Pull Request Automation | Safe PR generation, branch isolation, verification summaries |
| **10** | `creative-3d-web` | High-End Awwwards 3D WebGL | Three.js, GLTF, PBR shaders, camera choreography, luxury showcase |
| **11** | `database-design` | Relational & NoSQL Schema Design | PostgreSQL, MySQL, normalization, indexing, migration strategies |
| **12** | `debugging-strategies` | Hypothesis-Driven Defect Tracing | Root cause isolation, log instrumentation, regression traps |
| **13** | `designing-distributed-systems` | Resilient Distributed Architectures | CQRS, event sourcing, circuit breaker, saga, consensus |
| **14** | `ffmpeg` | Media Transcoding & Audio/Video Engineering | FFmpeg 8.1.1, NVENC, loudness normalization, ducking, subtitles |
| **15** | `figma` | Figma Component & Motion Integration | Figma tokens, Code Connect, reconstructed motion, layout sync |
| **16** | `find-skills` | Agent Skill Discovery & Installation | Ecosystem lookup, skill installation, capability search |
| **17** | `frontend-design` | Production-Grade Distinctive UI/UX | **[ENFORCED]** All frontend web layouts, UI artifacts, design polish |
| **18** | `gamified-3d-scrollytelling` | Interactive 3D Gamified Portfolios | Virtual scroll physics, Mixamo rigging, collectible hitboxes, spatial SFX |
| **19** | `hyperframes` | Code-Rendered HTML Video Engine | HTML-to-video timeline engine, transitions, overlays, typography |
| **20** | `hyperframes-cli` | HyperFrames Scaffolding & Preview | Frame inspection, preview server, timeline debugging |
| **21** | `hyperframes-registry` | Pre-Built Video Component Catalog | Overlays, kinetic typography, CRT scanlines, camera motion |
| **22** | `interactive-portfolio` | High-Converting Creative Portfolios | Recruiter-friendly first impressions, visual hierarchy, project showcases |
| **23** | `lemo-opuscar` | Cinematic Generative Code-Films | Oil painting, watercolor, Ukiyo-e, teardown, satellite styles |
| **24** | `lint-and-validate` | Codebase Validation & Lint Verification | Mandatory post-change linting, typechecking, zero-error gates |
| **25** | `media-use` | Asset Procurement & Audio Mixing | HeyGen, voiceover ducking, color grading, audio placement |
| **26** | `nodejs-backend-patterns` | Scalable Node.js Backend Architecture | Clean architecture, DI, error middleware, async pipelines |
| **27** | `nodejs-best-practices` | Production Node.js Standards | Event loop health, graceful shutdown, stream management |
| **28** | `prd` | Product Requirements Document Generator | Feature scoping, acceptance criteria, milestone roadmaps |
| **29** | `product-build-orchestrator-skill-v2` | End-to-End Product Lifecycle | Multi-phase delivery (`PRD`, `ARCHITECTURE`, `RULES`, `PHASES`) |
| **30** | `production-code-audit` | Autonomous Production Quality Audit | Line-by-line scanning, pattern audit, enterprise readiness |
| **31** | `python-performance-optimization` | Profiling & High-Throughput Python | cProfile, line profiler, memory optimization, GIL mitigation |
| **32** | `python-pro` | Modern Python 3.12+ Idiomatic Code | Asyncio, FastAPI, Pydantic v2, Ruff, UV, typing |
| **33** | `ralph` | Autonomous Agent PRD Converter | Converts specs into `prd.json` format for autonomous agent loops |
| **34** | `react-best-practices` | Vercel React Performance Protocol | Waterfall elimination, server components, bundle optimization |
| **35** | `react-component-performance` | Component Re-Render Optimization | Memoization, selector isolation, context splitting |
| **36** | `remotion-to-hyperframes` | Remotion / React Video Porting | Frame-by-frame verification, CSS transition translation |
| **37** | `reverse-any-video` | Video Reconstruction in Code | Motion graphics, camera matching, visual decompilation |
| **38** | `rust-pro` | Systems Programming in Rust | Zero-cost abstractions, borrow checker, async Tokio, unsafe bounds |
| **39** | `security-auditor` | DevSecOps & Security Hardening | Vulnerability analysis, secret leak audits, OWASP Top 10 |
| **40** | `simplify` | Code Refactoring & Complexity Reduction | **[ENFORCED]** Post-implementation cleanup, DRY/KISS pruning |
| **41** | `slideshow` | Live Interactive Code Presentations | Live deck presentation, fragment reveals, presenter mode |
| **42** | `style-sampling` | Proven Video Genre Sampling | Finance explainer, documentary, 3D brand storytelling |
| **43** | `systematic_debug` | Root-Cause Investigative Debugging | **[ENFORCED]** Bug triage, hypothesis formulation, trace reproduction |
| **44** | `systems-programming-rust-project` | Bare-Metal & OS-Level Rust | Memory allocators, device drivers, concurrency primitives |
| **45** | `taste-skill` | 12-Pack Aesthetics & Brandkit Suite | Brutalist, minimalist, stitch, image-to-code, soft design |
| **46** | `test-driven-development` | Red-Green-Refactor Testing Protocol | Unit/integration testing prior to production implementation |
| **47** | `typescript-advanced-types` | Advanced Type-Level Programming | Conditional types, mapped types, template literal types |
| **48** | `typescript-pro` | Enterprise TypeScript Engineering | Strict null checking, type guards, decorators, module federation |
| **49** | `ui-ux-pro-max-skill` | 7-Skill Enterprise UI/UX Design System | Brand design, banner design, slides, styling, design systems |
| **50** | `visual_ui_testing` | Autonomous Headless Browser UI Audit | **[ENFORCED]** Playwright/Chromium verification of frontend changes |
| **51** | `web-search` | Multi-Source Web Search & Extraction | Tavily & Exa CLI search, content extraction, live citation lookup |

---

## 3. 🔍 Category Breakdown & Deep-Dives

### 3.1 Architecture, Governance & Orchestration
- **`architect`**: Requires the agent to produce a structured system specification before modifying more than two files.
- **`product-build-orchestrator-skill-v2`**: Implements standardized Notion-style specifications (`PRD.md`, `ARCHITECTURE.md`, `RULES.md`, `DESIGN.md`, `MEMORY.md`, `PHASES.md`).
- **`prd` & `ralph`**: Automates product requirement documentation and conversion into deterministic autonomous execution matrices (`prd.json`).

### 3.2 Frontend Design, 3D WebGL & Aesthetics
- **`frontend-design` & `colours for websites`**: Eliminates generic "AI slop" aesthetics through intentional contrast, royal blue/cream and wine/sandal palettes, and tactile typography.
- **`creative-3d-web` & `gamified-3d-scrollytelling`**: Specialized architectures for Three.js WebGL scenes, Mixamo vehicle rigging, swept AABB physics, custom vertex/fragment shaders, and procedural PBR materials.
- **`taste-skill` & `ui-ux-pro-max-skill`**: Comprehensive multi-skill suites providing curated aesthetic guidelines across brutalism, minimalism, branding, and design tokens.

### 3.3 Video, Media & Creative Engineering
- **`hyperframes` Suite (`hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `remotion-to-hyperframes`, `reverse-any-video`, `slideshow`, `style-sampling`)**: Complete code-first motion design platform that turns HTML/CSS/JS into 60fps video renders.
- **`ffmpeg`**: Windows-tested hardware-accelerated (`h264_nvenc`) encoding, loudness normalization (EBU R128), and sidechain audio ducking.
- **`lemo-opuscar`**: Artistic code-directed short films in distinct fine-art visual styles.

### 3.4 Backend, Distributed Systems & Database Architecture
- **`caching-patterns` & `caching-strategy`**: Production patterns for Redis cache-aside, cache warming, stampede prevention, and multi-tier invalidation.
- **`designing-distributed-systems`**: Implementations of circuit breakers, consistent hashing rings, event sourcing stores, and saga orchestrators.
- **`database-design`**: Relational indexing, normalization, and ACID transaction boundaries.

### 3.5 Language Pro Specialists & Framework Best Practices
- **`python-pro` & `python-performance-optimization`**: Python 3.12+ async architectures, cProfile optimization, and FastAPI design.
- **`typescript-pro` & `typescript-advanced-types`**: Type-safe generics, mapped types, and enterprise patterns.
- **`react-best-practices` & `react-component-performance`**: Strict Vercel performance protocol for eliminating request waterfalls and minimizing client re-renders.
- **`rust-pro` & `cpp-pro`**: Memory-safe and high-performance native systems programming.

### 3.6 Debugging, Testing, Audit & Performance
- **`systematic_debug` & `debugging-strategies`**: Eliminates guess-and-check coding through hypothesis validation and root-cause tracing.
- **`visual_ui_testing`**: Spawns headless browser audits to inspect rendered DOM layout and console health after frontend changes.
- **`production-code-audit` & `security-auditor`**: Deep static analysis for security vulnerabilities, secret leaks, and maintainability.

---

## 4. 🚀 Installation & Agent Integration

### Loading in Google Antigravity / Gemini CLI
Place skills in the user configuration directory:
```bash
# Primary active directory:
~/.gemini/config/skills/
```

### Loading in Claude Code
Symlink or copy skills into your project or user Claude skills directory:
```bash
# User-level Claude skills:
~/.claude/skills/
```

### Loading in OpenCode / Codex / Custom Agents
Point the agent's global skills discovery configuration to:
```bash
L:\skills
# or
L:\opencode\founded skills
```

---

## 5. 🛡️ Quality & Security Guarantees

Every skill in this repository passes rigorous continuous verification gates:

- [x] **Zero Hardcoded Secrets**: Scanned against GitHub PATs, OpenAI API keys, Google Cloud credentials, AWS keys, and private key headers.
- [x] **Valid YAML Frontmatter**: Every `SKILL.md` contains valid `name` and quoted `description` metadata blocks.
- [x] **No Build / VCS Noise**: Completely stripped of `.git`, `__pycache__`, `.coverage`, `.pyc`, and operating system cache files.
- [x] **Tested on Windows & Linux**: Validated across Windows PowerShell and Unix-like bash environments.

---

*Maintained with pride by [KARTHIKEYASHARMA672](https://github.com/KARTHIKEYASHARMA672).*
