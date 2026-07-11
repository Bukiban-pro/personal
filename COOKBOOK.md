# COOKBOOK — Operations Manual

You're an agentic engineer in a zero-trust world. This is your playbook. Open any mission when you need it.

---

## Mission: Ace the Java Backend Interview

**Prep time:** 30 min/day for 4 weeks

```
1. Open career/developer-playbook.md
   → Follow the daily Passive + Active mode. That's it. Do not skip.
2. Open career/applications.md
   → Track every application. Companies: KMS, Endava, VNG, Axon Active, ELCA.
3. (Optional) Load references/frameworks/universal-learning-os.md
   → Use the 3-pass method on any topic you're weak on (DSA, Spring Boot, SQL joins).
```

**Win condition:** You walk into any interview and talk like a senior, not a fresher.

---

## Mission: Ship a Feature (with AI)

**Prep time:** 5 min

```
1. Load references/prompts/agent-session-kickoff.md
   → Paste the kickoff prompt to your AI agent. This sets the operating contract.
2. Load references/prompts/copilot-instructions-template.md
   → Customize for this specific feature. Define: what, why, stack, constraints.
3. Start coding. Agent handles discovery, you make decisions.
```

**Win condition:** Feature ships with reviewable artifacts (diff, tests, handoff summary).

---

## Mission: Review Code Like a Senior Architect

**Prep time:** 2 min

```
Pick your style:

- references/prompts/inquisitor-system.md
  → Systematic: "Every flaw is systemic." 3-pass rinsing. Use for thorough reviews.

- references/prompts/dev-leroy-reviewer.md
  → Brutal: "I view mediocre code as a personal insult." Use for critical PRs or when
    you need to look like the meanest engineer in the room.
```

**Win condition:** You spot the root cause, not just the symptom. Author walks away convinced.

---

## Mission: Woo Investors / Stakeholders

**Prep time:** 15 min

```
1. Load references/prompts/investor-demo-copilot.md
   → Dual persona: Steve Jobs energy (Cofounder) + unbreakable systems (Admin).
2. Follow the 5-step process: landscape → story → live → objection → close.
3. Demo chefkix service: uvicorn projects/chefkix/perception/service/app:app --reload
4. (Pro move) Mention the architecture: FastAPI + YOLOv8/RT-DETR + ONNX export.
```

**Win condition:** Investors believe you're shipping production AI, not a hackathon project.

---

## Mission: Build a UI in Minutes

**Prep time:** 10 min

```
1. Browse the stash:
   - By shelf:  projects/ui-patterns/components/shelves/{shelf-name}/
   - By name:   projects/ui-patterns/library/by-name/
   - Overview:  projects/ui-patterns/README.md
2. Copy the component files into your target project.
3. Install deps: react, framer-motion, clsx, tailwind-merge, lucide-react, @radix-ui/*
4. Preview in ui-gallery to test: npm run dev --prefix projects/ui-gallery
```

**Win condition:** You assembled a production-grade UI in the time it takes others to install Bootstrap.

---

## Mission: Start a New Project from Scratch

**Prep time:** 20 min

```
1. Choose your architecture blueprint:
   - Microservices / monolith setup → references/frameworks/dev-mode-blueprint.md
   - Zero-budget AI stack            → references/frameworks/agentic-hands-2026.md
   - Offline-first agentic workflow  → references/frameworks/web-brain-agentic-hands.md
2. Load references/workflows/core-workflow.md → git flow, branch naming, PR standards
3. Fire up the AI agent:
   - Load references/prompts/copilot-instructions-template.md
   - Tell it to produce: PLAN.md → TASKS.md → HANDS_LOG.md
```

**Win condition:** Day 1 you have: repo structure, CI/CD, dev loop, agent contract, and a plan.

---

## Quick Reference

| I need to... | Open this |
|---|---|
| Prepare for an interview | `career/developer-playbook.md` |
| Start a coding session with AI | `references/prompts/agent-session-kickoff.md` |
| Review code thoroughly | `references/prompts/inquisitor-system.md` |
| Get brutally reviewed | `references/prompts/dev-leroy-reviewer.md` |
| Prep an investor demo | `references/prompts/investor-demo-copilot.md` |
| Design UI components | `references/prompts/agent-role-definitions.md` |
| Learn a new topic fast | `references/frameworks/universal-learning-os.md` |
| Set up project dev infrastructure | `references/frameworks/dev-mode-blueprint.md` |
| Run parallel agents without conflict | `references/frameworks/dual-agent-concurrency-protocol.md` |
| Run chefkix smoke test | `python projects/chefkix/perception/scripts/phase1_smoke.py --output-dir runs/phase1_smoke` |
| Run ui-gallery locally | `npm run dev --prefix projects/ui-gallery` |
| Regenerate component catalogs | `powershell -File projects/ui-patterns/docs/generate-ui-lab-library-catalog.ps1` |
| Read deep AI context engineering | `research/ai-context-engineering/extreme-context-engineering-p1.md` |
| Pick a free LLM provider | `references/prompts/llm-model-selection.md` |
