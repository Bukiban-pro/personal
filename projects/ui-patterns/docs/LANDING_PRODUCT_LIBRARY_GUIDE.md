# LandingProduct Library Guide

This file turns the LandingProduct archive into a usable library. Start here, not in the raw components folder.

## Current Snapshot
- Total component files: 588
- LandingProduct components: 321
- Parent guide: `ui_lab/docs/UI_LAB_LIBRARY_GUIDE.md`
- Repo-level registry: `ui_lab/configs/ui-lab-registry.json`
- Source of truth: `ui_lab/HANDOFF_UI_MINING_2026-05-06.md`
- Machine-readable registry: `ui_lab/configs/landing-product-registry.json`
- Generator: `ui_lab/docs/generate-landing-product-catalog.ps1`

## Operating Rules
1. Do not start in the runtime frontier unless the page already has a clean business story.
2. Pick one chapter first, then pull a starter kit, then add only the few extra sections the page really earns.
3. Keep one governing metaphor per page. Mixing boardroom, compiler, theater, radar, and atlas language all at once weakens the page.
4. Cap the first composition at 6-8 sections. A library becomes a pile the moment every page tries to show off everything.

## Starter Kits

### Fast Proof Page
- Use when: You need a credible first-pass landing page without drifting into ornamental systems language.
- Chapter: `conversion-proof`
- Components: `LandingProductProof`, `LandingProductComparison`, `LandingProductMetrics`, `LandingProductFeatureMatrix`, `LandingProductSocialProof`, `LandingProductPricingComparison`, `LandingProductCTAStack`, `LandingProductFAQColumns`
- Caution: Keep this lean. Six to eight sections is enough for a first useful composition.

### Enterprise Deal Room
- Use when: You need one page that can support procurement, security, technical validation, and executive review at the same time.
- Chapter: `enterprise-buying`
- Components: `LandingProductSecurityCompliance`, `LandingProductTechnicalValidation`, `LandingProductBusinessCaseBuilder`, `LandingProductProcurementPack`, `LandingProductGovernanceModel`, `LandingProductExecutiveReviewPack`, `LandingProductDecisionBoard`, `LandingProductProofCartography`
- Caution: Do not ship every enterprise block. Pick the pressure points that actually block the deal.

### Adoption and Expansion Loop
- Use when: You need a customer-facing or internal success narrative that connects onboarding, adoption, renewal, and expansion.
- Chapter: `adoption-operations`
- Components: `LandingProductOnboardingChecklist`, `LandingProductEnablementTracks`, `LandingProductAdoptionDashboard`, `LandingProductQBRFramework`, `LandingProductRenewalSignals`, `LandingProductExpansionScorecard`, `LandingProductCustomerHealth`, `LandingProductAdvocacyLoop`
- Caution: Resist adding buyer-stage sections here. This kit should feel post-sale and operational.

### Operating System Page
- Use when: You want the product to read like an operating model, not just a feature list.
- Chapter: `narrative-systems`
- Components: `LandingProductOperatingModel`, `LandingProductDecisionLedger`, `LandingProductOwnershipGrid`, `LandingProductOperatingCanvas`, `LandingProductSignalStudio`, `LandingProductExecutionBoard`, `LandingProductTrustCommandCenter`, `LandingProductOperatingSystem`
- Caution: Use one governing metaphor. Mixing too many system metaphors makes the page feel self-impressed.

### Boardroom Finale
- Use when: You need a high-conviction executive page and you are willing to be selective and disciplined with theatrical surfaces.
- Chapter: `ritual-finale`
- Components: `LandingProductExecutiveBridge`, `LandingProductCommandBriefing`, `LandingProductBoardroomSystem`, `LandingProductDecisionCouncil`, `LandingProductTrustDossier`, `LandingProductSignalChamber`, `LandingProductStoryBoardroom`, `LandingProductStoryCeremony`
- Caution: This is the sharpest aesthetic layer. Use it only after the underlying buying story is already clear.

## Library Chapters

### Conversion and Proof (41)
- Description: Start here for sane landing pages: proof, comparison, metrics, pricing, objections, and direct conversion scaffolding.
- Waves: `Landing Product Legacy Foundation`, `Landing Product Core Expansion`, `Landing Product Conversion Layer`, `Landing Product Trust + Objection Layer`, `Post-Handoff Conversion Expansion`
- Good first picks: `LandingProductProof`, `LandingProductComparison`, `LandingProductMetrics`, `LandingProductFeatureMatrix`, `LandingProductSocialProof`, `LandingProductPricingComparison`, `LandingProductCTAStack`, `LandingProductComparisonChecklist`

### Enterprise Buying (48)
- Description: Use this chapter when the page has to survive procurement, security review, rollout friction, and buyer-committee scrutiny.
- Waves: `Post-Handoff Buyer Ops Expansion`, `Post-Handoff Enterprise Edge Expansion`, `Post-Handoff All-Aspects Expansion`, `Post-Handoff Threshold Expansion`
- Good first picks: `LandingProductTechnicalValidation`, `LandingProductGovernanceModel`, `LandingProductBusinessCaseBuilder`, `LandingProductExecutiveReviewPack`, `LandingProductRegionalRollout`, `LandingProductCustomerReferenceProgram`, `LandingProductEnterpriseReadiness`, `LandingProductEvaluationCriteria`

### Adoption and Operations (36)
- Description: Pull from this chapter for onboarding, enablement, QBR, renewal, account planning, change management, and operating rhythm.
- Waves: `Post-Handoff Retention + Enablement Expansion`, `Post-Handoff Ops Depth Expansion`, `Post-Handoff Design Depth Expansion`
- Good first picks: `LandingProductOnboardingChecklist`, `LandingProductEnablementTracks`, `LandingProductAdoptionMilestones`, `LandingProductQBRFramework`, `LandingProductCustomerHealth`, `LandingProductAccountPlanning`, `LandingProductGovernanceCalendar`, `LandingProductOperatingRhythm`

### Narrative Systems (76)
- Description: This is the bridge from ordinary SaaS sections into operating-model, storyline, topology, and executive-systems language.
- Waves: `Post-Handoff Narrative Systems Expansion`, `Post-Handoff Orchestration Systems Expansion`, `Post-Handoff Architecture Systems Expansion`, `Post-Handoff Radical Systems Expansion`, `Post-Handoff Control Surface Expansion`, `Post-Handoff Topology Control Expansion`, `Post-Handoff System Wave Expansion`
- Good first picks: `LandingProductExecutiveNarrative`, `LandingProductOperatingModel`, `LandingProductStoryArchitecture`, `LandingProductOperatingCanvas`, `LandingProductNarrativeBriefing`, `LandingProductTrustCommandCenter`, `LandingProductExecutionAtlas`, `LandingProductOperatingSystem`

### Runtime Frontier (70)
- Description: Treat this as a specialized layer. It is powerful, but it should be used intentionally after the page already has clear business structure.
- Waves: `Post-Handoff Protocol Primitives Expansion`, `Post-Handoff Harsher Primitives Expansion`, `Post-Handoff Runtime Frontier Expansion`, `Post-Handoff Compiler Systems Expansion`, `Post-Handoff Interpreter Runtime Expansion`, `Post-Handoff Extreme Systems Expansion`, `Post-Handoff Protocol Pressure Expansion`
- Good first picks: `LandingProductTrustProtocol`, `LandingProductRecoveryWorkbench`, `LandingProductProtocolEngine`, `LandingProductDecisionCompiler`, `LandingProductOperatingRuntime`, `LandingProductTrustCompiler`, `LandingProductInfluenceProtocol`, `LandingProductConfidenceRuntime`

### Ritual Finale (50)
- Description: These are the sharpest page-scale surfaces: command rooms, archives, bridges, cartography, councils, dossiers, ceremony, and boardroom systems.
- Waves: `Post-Handoff Control Breakout Expansion`, `Post-Handoff Command Surface Expansion`, `Post-Handoff Structural Breakout Expansion`, `Post-Handoff Cartography + Terminal Expansion`, `Post-Handoff Ritual Systems Finale`
- Good first picks: `LandingProductCommandSurface`, `LandingProductTrustRegistry`, `LandingProductExecutiveBridge`, `LandingProductProofCartography`, `LandingProductDecisionTerminal`, `LandingProductBoardroomSystem`, `LandingProductTrustDossier`, `LandingProductStoryCeremony`

## QA Status
- Snapshot counts match the actual `ui_lab/components` folder.
- Every `LandingProduct*.tsx` file is represented in the wave inventory.
- Every wave is assigned to exactly one top-level chapter.
- Every starter kit references existing components only.

## Refresh Command
```powershell
Set-Location 'c:\Users\Bukanto\Downloads\pp\personal'
.\ui_lab\docs\generate-landing-product-catalog.ps1
```
