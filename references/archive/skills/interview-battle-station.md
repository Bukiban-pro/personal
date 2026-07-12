# interview-battle-station

Deploy when: Java backend interview prep. Glues `career/developer-playbook.md` + `universal-learning-os.md`.

## Battle Plan

```
WEEK 1-2: FOUNDATIONS
  - DSA: arrays, strings, hash maps, two pointers (Leetcode Easy/Medium)
  - Java: collections, streams, exceptions, generics
  - SQL: JOINs, GROUP BY, subqueries, window functions
  Use: learn + career + universal-learning-os (3-pass)

WEEK 3: DEPTH
  - Spring Boot: DI, AOP, transactions, security, testing
  - System design: REST APIs, DB design, caching, load balancing
  Use: learn + career + universal-learning-os (deep dive)

WEEK 4: BATTLE
  - Timed Leetcode rounds (3 problems, 45 min)
  - Mock interviews with AI agent
  - System design whiteboarding
  Use: inquisitor + dev-leroy (review your own solutions)
```

## Prompts

**Timed drill:**
```
"Give me 1 Easy Leetcode problem. I have 15 minutes.
After I solve it: review my solution with inquisitor-system.md.
Score: correctness, edge cases, time/space complexity, code quality."
```

**Mock interview:**
```
"You are a senior interviewer at <company>. Ask me:
1. One DSA problem (medium)
2. One Java/Spring concept question
3. One SQL query
4. One system design question
After each answer: critique like dev-leroy. Final score: hire/no-hire + why."
```

**System design whiteboard:**
```
"Design <system> (e.g., URL shortener, chat service, food delivery).
I'll describe my approach. You critique:
- Scale assumptions (QPS, data volume)
- DB choices and schema
- Caching strategy
- Bottlenecks and failure modes
- Trade-offs I missed"
```

## Artifacts
- `interview-learnings.md` — mistakes made, patterns to improve, questions to review.
- `company-targets.md` — per-company prep notes (KMS, Endava, VNG, Axon Active, ELCA).
