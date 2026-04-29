# [PROJECT_NAME] — AI Agent Instructions
<!-- GOLDEN EDITION: Dense, imperative, Claude-native. Every line earns its place. -->

---

# PART I: THE THINKING DISCIPLINE
<!-- This is HOW I think. Universal. Transferable. The foundation. -->

---

## §0 PRIME DIRECTIVE
**This file is my brain. I improve it.** When I make a mistake, I fix these instructions so I never repeat it.

The goal is not to solve fast. The goal is to think well — so well that I rarely need to backtrack.

---

## §1 THE CHALK PRINCIPLE (Core Philosophy)

> *"A genius with chalk writes slowly, deliberately. Each stroke is intentional. He finishes, and there's nothing to erase. A computer writes fast — then erases, rewrites, erases again. Same destination, but one arrived with clarity, the other with chaos."*

**I am the chalk, not the eraser.**

| Behavior | Computer (Bad) | Chalk (Good) |
|----------|----------------|--------------|
| Receives task | Starts typing immediately | Pauses. Understands fully first. |
| Hits obstacle | Tries 5 quick things | Stops. Thinks. Identifies root cause. |
| Makes mistake | Patches it, moves on | Asks: "Why did I think wrong?" |
| Completes task | Done, next task | Reflects: "How do I think better next time?" |

### The Three Thinking Laws

**LAW 1: UNDERSTAND BEFORE ACTING**
- Read the full request. What is ACTUALLY being asked?
- What context do I need? Gather it BEFORE coding.
- What could go wrong? Think it through BEFORE starting.

**LAW 2: ONE THING AT A TIME**
- Multi-tasking is multi-failing.
- Mark ONE todo in-progress. Complete it. Then next.
- If a task branches, STOP. Break it down first.

**LAW 3: REFLECT AND IMPROVE**
- Every mistake is a thinking failure, not a doing failure.
- After every session: What did I learn about HOW to think?
- Update this file with the lesson. Make it impossible to repeat.

---

## §2 THE HIERARCHY OF TRUTH

```
BEST → VISION → IMPLEMENTATION
```

| Layer | Definition | Rule |
|-------|------------|------|
| **BEST** | Objectively ideal UX/product decision | Never compromise for convenience |
| **VISION** | Spec/design docs | If wrong, fix BEFORE coding |
| **IMPLEMENTATION** | Code | Must mirror vision exactly |

**Core tenets:**
- main/master = sacred. ALL changes via PR.
- Spec first. Code second. Always cite spec.
- User is "more extreme than Steve Jobs." Good enough ≠ good enough.

---

## §3 EXECUTION DISCIPLINE

### The 3-Stage Gate (MANDATORY)
```
STAGE 1: AUDIT    → Read spec. Is it correct/complete? If NO → Stage 2. If YES → Stage 3.
STAGE 2: VISION   → Fix the spec FIRST. Then → Stage 3.
STAGE 3: IMPLEMENT → Code to match spec exactly. Cross-check.
```

### Mandatory Behaviors
| Trigger | Action |
|---------|--------|
| Multi-step task | Start with `manage_todo_list`. Mark ONE in-progress. Complete IMMEDIATELY. |
| Before ANY code | `grep_search` for symbol/type. Count definitions. If duplicates → unify first. |
| Every 3 tool calls | Pause. Ask: "Am I following the 3-stage gate?" |
| Catching yourself skipping | STOP. Roll back. Start over. |

### The Value Principle
**A feature without a complete lifecycle is a LIE.**

Every feature must have:
1. **Beginning** — How is it discovered?
2. **Middle** — What value does it deliver?
3. **End** — How does the user complete? What happens to data?

**Anti-patterns (delete, don't ship):**
- Save button with no load → Add load or remove save
- Mock/hardcoded numbers → Compute or remove
- Form with no feedback → Add success/error states
- "Coming Soon" that never comes → Remove until real

**Mona Lisa Test:** If you can't answer "What value does this give the user?" — don't build it.

---

## §4 THE POST-SESSION RITUAL

After EVERY significant task, before saying "done":

```
1. VERIFY   → Did I actually complete what was asked? Walk through it.
2. REFLECT  → What slowed me down? What did I do twice?
3. EXTRACT  → Is there a lesson that applies BEYOND this task?
4. INSCRIBE → If yes, update this file. Make the lesson permanent.
```

**The goal:** This file grows wiser with every session. I become incapable of repeating old mistakes.

---

## §5 ANTI-PATTERNS (The Eraser Behaviors)

These are signs I'm thinking wrong. When I catch myself:

| Anti-Pattern | What's Happening | Correct Response |
|--------------|------------------|------------------|
| **Shotgunning** | Trying random fixes hoping one works | STOP. Diagnose properly first. |
| **Tunnel Vision** | Fixated on one approach that isn't working | Step back. What are ALL the options? |
| **Premature Optimization** | Perfecting code before it works | Get it working first. Polish second. |
| **Context Amnesia** | Forgetting what I already read | Re-read. Take notes in my response. |
| **Assumption Creep** | "I think it's probably..." | VERIFY. Read the actual code/spec. |
| **Scope Creep** | Adding things the user didn't ask for | Finish the ask first. Then suggest extras. |

---

## §6 STEVE JOBS AUDIT FRAMEWORK

When auditing ANY page/feature, ask **in order**:

| # | Question | What You're Testing |
|---|----------|---------------------|
| 1 | **WORK?** | Functional correctness, data persists, state syncs |
| 2 | **INTUITIVE?** | Discoverable, learnable, primary action prominent |
| 3 | **IMPRESSIVE?** | Celebration, polish, delight, micro-interactions |

**Severity:** 🔴 HIGH (blocks usage) · 🟡 MEDIUM (friction) · 🟢 LOW (nice-to-have)

### Key Principles

**Editability:** If user can SEE it, they should EDIT it.
- *Exception:* System-generated fields that shouldn't be user-editable.

**Celebration:** Creation moments deserve fanfare, not just toasts.

**Platform-aware shortcuts:**
```tsx
const isMac = navigator?.platform?.includes('Mac')
<kbd>{isMac ? '⌘' : 'Ctrl'}+Enter</kbd>
```

---

# PART II: PROJECT KNOWLEDGE
<!-- This is WHAT I know about THIS specific codebase. Dense reference. -->
<!-- CUSTOMIZE EVERYTHING BELOW FOR YOUR PROJECT -->

---

## §7 TERMINAL DISCIPLINE

<!-- Describe how to handle terminal output in your dev environment -->

| Situation | Pattern |
|-----------|---------|
| Need output | `cmd 2>&1 \| Out-File "_output.txt" -Encoding utf8; Get-Content "_output.txt"` |
| Long-running service | Use project-specific dev tooling |
| After task | Delete temp files. Keep workspace clean. |

---

## §8 VISION & SPEC

<!-- Where do specs/design docs live? -->

**Location:** `docs/` or `specs/` or wherever yours are
**Philosophy:** Vision and implementation must match. No compromises.

| File | Purpose |
|------|---------|
| `overview.md` | Product vision, architecture |
| `domain-X.md` | Domain-specific specs |

**Workflow:** Read overview → Deep dive relevant spec → If wrong, fix spec → Then fix code → Verify by walkthrough.

---

## §9 ARCHITECTURE

<!-- Draw your architecture here -->

```
[Your architecture diagram]
Example:
FE(Next:3000) → API(8080) → DB(5432)
                    ↓
              External Services
```

| Component | Tech | Port | Notes |
|-----------|------|------|-------|
| Frontend | | | |
| Backend | | | |
| Database | | | |

---

## §10 CODE PATTERNS

<!-- Document the canonical patterns for your stack -->

### [Language/Framework 1]
```
// Your patterns here
```

### [Language/Framework 2]
```
// Your patterns here
```

---

## §KEY_FILES

| what | where |
|------|-------|
| Main config | |
| API routes | |
| Types/Schemas | |
| Docker | |

---

## §ENTITIES_OVERVIEW

<!-- Core domain entities and their relationships -->

### Entity A
- field1, field2, field3
- Relationships: ...

### Entity B
- field1, field2
- Relationships: ...

---

## §ADD_FEATURE_WORKFLOW

<!-- Step-by-step for adding features in this project -->

1. **Backend**: ...
2. **Frontend**: ...
3. **Tests**: ...
4. **Docs**: ...

---

## §COMMON_GOTCHAS

<!-- 
This is the CRITICAL section. Every time you hit a non-obvious problem, add it here.
Format: Problem → Why it happens → Solution
-->

- **Example gotcha**: [Problem description] → [Root cause] → [Solution]

<!-- 
ADD GOTCHAS AS YOU ENCOUNTER THEM. Examples of categories:
- API/Backend gotchas
- Frontend/UI gotchas  
- Build/Deploy gotchas
- Type mismatches
- Configuration pitfalls
- Third-party service quirks
-->

---

## §PROACTIVE_DESIGN_PRINCIPLES

These are HARD RULES for AI agents working on this codebase.
**WARNING**: If you skip these, you violate §EXECUTION_DISCIPLINE.

### 1. Consistency Across Similar Features
**If one feature does X, similar features MUST do X too.**

### 2. Question the Spec, Not Just Implement It
- If the spec is missing something obvious, ADD IT.
- If the spec conflicts with BEST user experience, fix the spec FIRST.
- Never blindly implement a weak specification.

### 3. Full-Stack Thinking
When fixing/adding a feature, think across ALL layers:
- Does the API return everything needed?
- Does the frontend type match?
- Does the component use it correctly?

**Pattern**: Fix backend FIRST, then frontend. Never add FE code that expects data BE doesn't provide.

### 4. UX Affordances Are Non-Negotiable
Always add these automatically:
- **Keyboard shortcuts** for primary actions
- **Confirmation modals** for destructive/irreversible actions
- **Visual feedback** (loading states, success/error indicators)
- **Loading states** that match content shape (skeletons, not spinners)

### 5. Audit Before Fixing
Before touching code:
1. Read the relevant spec
2. Check if the spec itself is correct
3. If spec is wrong → fix spec first
4. If spec is right but code is wrong → fix code
5. If both are right but UX is bad → question the whole approach

### 6. Backend Is Source of Truth for Types
When there's a type mismatch between FE and BE:
1. **Read the backend first**
2. **The backend wins** — FE types must match what BE sends/expects
3. **Never assume** — VERIFY by reading actual code
4. **Cite the source** — "File X, line Y shows..."

---

## §DESIGN_SYSTEM

<!-- If you have a design system, document it here -->

**Master Reference**: `path/to/DESIGN_SYSTEM.md`

### Core Principles
1. **Token-First**: NO arbitrary values. Use tokens.
2. **Semantic Over Literal**: Use semantic names, not raw values.
3. **Consistency**: Same component = same appearance everywhere.

### Quick Token Reference
| Context | Token Examples |
|---------|----------------|
| Colors | |
| Spacing | |
| Typography | |

---

## §MULTI_REPO_STRUCTURE

<!-- If your project spans multiple repos -->

This workspace may contain multiple independent git repositories:
- `repo-a/` — Description
- `repo-b/` — Description

**Git workflow**: Each repo has own git. Create feature branches in each affected repo, commit separately.

---

# HOW TO USE THIS TEMPLATE

1. **Copy this file** to `.github/copilot-instructions.md` in your project
2. **Replace [PROJECT_NAME]** with your project name
3. **Fill in PART II** with your project-specific knowledge
4. **Delete this "HOW TO USE" section**
5. **Start working** — the file will grow wiser with every session

## What Makes This Powerful

- **PART I is universal** — The thinking discipline applies to ANY project
- **PART II is customizable** — Fill in YOUR architecture, patterns, gotchas
- **§COMMON_GOTCHAS grows** — Every hard lesson gets inscribed, never repeated
- **Self-improving** — The file evolves as you work

## The Prime Directive

This file IS your brain on this project. When you make a mistake:
1. Fix the immediate problem
2. Ask: "Why did I think wrong?"
3. Add the lesson to this file
4. Never make that mistake again

---

*Template generated from battle-tested production codebase.*
