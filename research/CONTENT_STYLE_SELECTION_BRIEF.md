# Agent Input: Style Selection Dossier

## Mission
Pick the best visual style for this project from explicit available options.

This file is for an agent, not for a human implementation guide.

## Hard rule
Do not invent a new style name. Choose from the listed style options only.

## Human-agent split of responsibility
- Agent responsibility: choose the best style and justify it.
- Human responsibility: after style is chosen, manually obtain style-specific implementation prompt externally.
- This file is only for style commitment quality, not code generation and not implementation prompting.

## What this project content is
- Static captured pages from Design Prompts.
- A style explorer shell plus a full Monochrome-rendered sample.
- Underneath the style treatment, the content is a complete B2B SaaS marketing site for a fictional product (Acme Inc.).

## Important context about available evidence
- The local snapshot includes a full rendered page for Monochrome.
- The explorer list contains many style options, but not all full pages are locally rendered in this workspace.
- Therefore, style choice must be inferred from content fit, not from seeing every style rendered.

## Content structure to optimize for
1. Header/navigation
2. Hero with primary and secondary CTA
3. Social-proof stats
4. Sponsors
5. About section
6. Features grid
7. Blog cards
8. Process/how-it-works
9. Benefits list
10. Testimonials
11. Pricing
12. FAQ
13. Final CTA
14. Footer

## Audience and brand intent
- Audience: B2B buyers, product leads, ops leads, founders, enterprise-leaning teams.
- Needed feeling: trustworthy, premium, clear, decisive.
- Avoid: childish, noisy, gimmicky, or hard-to-scan aesthetics.

## Recovered style option set from the explorer snapshot (30 options)
1. Monochrome
2. Bauhaus
3. Modern Dark
4. Newsprint
5. SaaS
6. Luxury
7. Terminal
8. Swiss Minimalist
9. Kinetic
10. Flat Design
11. Art Deco
12. Material Design
13. Neo Brutalism
14. Bold Typography
15. Academia
16. Cyberpunk
17. Web3
18. Playful Geometric
19. Minimal Dark
20. Claymorphism
21. Professional
22. Botanical
23. Vaporwave
24. Enterprise
25. Sketch
26. Industrial
27. Neumorphism
28. Organic
29. Maximalism
30. Retro

## Evidence and validity ledger
Validated directly from the captured explorer file:
- Total indexed styles found: 30
- Unique style names: 30
- Index continuity: 01 through 30 present
- Mode metadata extracted per style: yes
- Mode split: 21 Light, 9 Dark

Implication:
- The option inventory is internally consistent for this snapshot.
- If the live website now has more than 30 styles, that is outside local evidence and should not be assumed by the selecting agent.

## Known limits and confidence boundaries
- High confidence: style names, style count, per-style light/dark label, and page content architecture in this workspace snapshot.
- Medium confidence: inferred fit quality for options without locally rendered full pages.
- Low confidence: any claim about newly added styles not present in this snapshot.

Mandatory behavior for the next agent:
- Treat missing render data as uncertainty, not as evidence.
- If two top candidates are close (within 3 weighted points), explicitly explain tie-break reasoning.

## Fit guidance by tier (starting hypothesis, not final verdict)
Tier A (highest probability fit for this content):
- Monochrome
- Swiss Minimalist
- Professional
- Enterprise
- Newsprint
- Minimal Dark

Tier B (can work with careful execution):
- SaaS
- Modern Dark
- Bauhaus
- Art Deco
- Luxury
- Material Design
- Flat Design
- Industrial
- Academia
- Bold Typography

Tier C (high risk for trust/clarity mismatch unless strongly justified):
- Cyberpunk
- Vaporwave
- Web3
- Playful Geometric
- Maximalism
- Retro
- Neo Brutalism
- Sketch
- Terminal
- Claymorphism
- Neumorphism
- Botanical
- Organic
- Kinetic

## Decision rubric (weighted)
Score each candidate out of 10 for each criterion, then compute weighted total out of 100.

- Trust and credibility for B2B: 25
- Conversion clarity across full funnel sections: 20
- Handling of dense information (pricing, FAQ, feature blocks): 20
- Mobile readability and rhythm: 15
- Distinctiveness without hurting usability: 10
- Scalability/reusability across future pages: 10

## Required output format from the next agent
Return exactly:
1. Primary chosen style (one from list).
2. Two backup styles (from list).
3. Scoring table for top 5 candidates using the weighted rubric.
4. One-paragraph rationale for the winner.
5. Practical visual direction for winner:
- typography direction
- color direction
- spacing/layout rhythm
- CTA treatment
- component tone for pricing and FAQ
6. Risk list (3 risks) and mitigations.
7. Confidence statement using this exact format:
- Data confidence: High/Medium/Low
- Recommendation confidence: High/Medium/Low
- Main uncertainty source: one sentence

## Output constraints for the next agent
- Keep recommendation grounded in this specific content architecture.
- Do not output code.
- Do not output generic moodboard language without decision logic.
- Do not recommend more than one primary style.
- Do not claim to have visually inspected styles that are not locally rendered in this workspace.

## Prompt block to feed another agent
Choose the best style for this B2B SaaS marketing content from this fixed option set only:
Monochrome, Bauhaus, Modern Dark, Newsprint, SaaS, Luxury, Terminal, Swiss Minimalist, Kinetic, Flat Design, Art Deco, Material Design, Neo Brutalism, Bold Typography, Academia, Cyberpunk, Web3, Playful Geometric, Minimal Dark, Claymorphism, Professional, Botanical, Vaporwave, Enterprise, Sketch, Industrial, Neumorphism, Organic, Maximalism, Retro.

Use this content structure: header, hero, stats, sponsors, about, features, blog cards, process, benefits, testimonials, pricing, FAQ, CTA, footer. Audience is B2B decision-makers. Prioritize trust, conversion clarity, readability, and premium feel.

Return:
1) one primary style, 2) two backups, 3) weighted scoring table for top 5, 4) rationale for winner, 5) practical design direction, 6) key risks and mitigations.