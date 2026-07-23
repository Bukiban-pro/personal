---
name: md-to-tts-feynman
description: Transform Markdown, transcripts, papers, technical reports, or structured notes into a natural text-to-speech response that remains understandable even when the listener is tired. Explain from first principles, move from low level to high level, preserve important findings, distinguish proof from inference, minimize bilingual friction, and never invent unsupported claims.
---

# MD to TTS Feynman

## Purpose

Turn Markdown, transcripts, research notes, papers, technical documents, or structured text into a response that can be listened to naturally with text to speech.

The output must not sound like a Markdown file being read aloud.

It must sound like a calm, technically credible person explaining the material directly to a tired listener who still wants the real value.

The goal is not merely to simplify.

The goal is to remove barriers to understanding without lowering the intellectual ceiling.

A beginner should be able to enter.

A strong engineer should still find the important mechanisms, evidence, limitations, and applied value intact.

## Core Promise

The response must help the listener answer four questions:

1. What problem is being solved?
2. How does the mechanism actually work?
3. What did the source really prove?
4. What remains weak, uncertain, or unsolved?

If the listener can explain those four things in their own words, the transformation succeeded.

## Default Priorities

Use this order of priority:

1. Factual fidelity.
2. Comprehension while tired.
3. Natural listening flow.
4. Practical engineering value.
5. Recall.
6. Technical terminology only where useful.
7. Completeness without overload.

Never trade factual accuracy for a smoother story.

Never preserve complexity merely to sound advanced.

## Trigger Examples

Use this skill when the user says things such as:

- TTS Feynman this.
- Convert this Markdown into a TTS response.
- Make this understandable even when I am tired.
- Explain this paper so it actually sticks.
- Turn this transcript into content.
- Focus on the task, not the conversation.
- Preserve the value and do not hallucinate.
- Explain from low level to high level.
- Make this listenable.
- Remove the Markdown.
- Help me understand the findings.
- Make this response, not a generated audio file.

## Output Type

By default, return the transformed content directly in the response.

Do not create an audio file.

Do not create a text file.

Do not create a downloadable artifact unless the user explicitly asks for a file.

“TTS” means text written for text-to-speech playback, not generated speech.

## Choose the Correct Mode

### Mode 1: Faithful Spoken Conversion

Use when the user wants the source preserved almost completely.

In this mode:

- Preserve all substantive content.
- Do not summarize silently.
- Do not add new explanations unless required for listening clarity.
- Remove Markdown and visual formatting.
- Convert lists, tables, diagrams, and headings into spoken transitions.
- Preserve numbers, caveats, uncertainty, ownership, and evidence.
- Rephrase only when the original structure would sound unnatural aloud.

### Mode 2: Feynman Understanding

Use when the user wants to understand, retain, or explain the material.

In this mode:

- Explain the job of a concept before naming it.
- Build from concrete intuition to mechanism.
- Introduce only one new conceptual burden at a time.
- Prefer problem, mechanism, evidence, limitation.
- Use one analogy only when it genuinely clarifies.
- Remove terminology that adds no engineering value.
- Keep the exact technical term when the user may need it later.
- Repeat the central model in compressed form at the end.

### Mode 3: Fatigue-Proof Research Findings

Use when the source is a paper, literature review, research transcript, or critical analysis.

This is the default for research material.

In this mode:

- Explain one paper or one system at a time.
- Begin with the simplest mental picture.
- Move from low level to high level.
- Separate mechanism, findings, evidence, and limits.
- State what the paper proves.
- State what it only claims.
- State what is inferred by the analyst.
- State what remains unsupported.
- Preserve exact benchmark conditions and important numbers.
- Do not turn a benchmark result into a universal claim.
- End each paper with a short, memorable verdict.

### Mode 4: Spoken Presentation or Defense

Use when the material will be presented aloud.

In this mode:

- Write for the mouth, not the page.
- Use short, complete sentences.
- Lead with the task and why it matters.
- Explain visible evidence before architecture inventory.
- Avoid acronym chains.
- Give clear transitions.
- End with a strong but defensible conclusion.
- Never exaggerate beyond the source.

## Fatigue-Proof Design

Assume the listener may be mentally tired.

This changes how the response must be written.

### One Burden at a Time

Do not introduce several unfamiliar ideas in one sentence.

Bad:

“DeepLog uses Spell, LSTM-based next-key prediction, parameter-vector time-series modeling, and FSA-based diagnosis.”

Better:

“DeepLog first turns raw log messages into stable event types.

It then learns which event usually comes next.

Separately, it learns whether timing and numerical values look normal.

After an anomaly is detected, it can reconstruct the workflow to help locate the failure.”

### Progressive Depth

Use three invisible depth layers.

First, the concrete picture.

Second, the actual mechanism.

Third, the engineering meaning.

Example:

“DeepLog treats logs like a sentence.

Each log type acts like a word.

An LSTM predicts what should come next.

The engineering lesson is that order matters, so logs must first be separated into correct per-task sequences.”

Do not label every layer unless labels improve clarity.

### Stable Order

For each paper, system, or component, prefer this order:

1. The problem.
2. The concrete mental picture.
3. The data representation.
4. The mechanism.
5. The result.
6. The dependency behind that result.
7. The limitation.
8. The applied finding.
9. The compressed verdict.

Do not jump repeatedly between architecture, criticism, metrics, and application.

### Local Recaps

After a difficult mechanism, give a short recap before moving on.

Example:

“So DeepLog checks two things.

Did the system take the wrong step?

And even if the step was correct, did it happen with abnormal timing or values?”

Do not recap every paragraph.

Use recaps only at major cognitive boundaries.

## Source Fidelity and Anti-Hallucination Rules

These rules are mandatory.

### Source of Truth

When a source document is provided:

- Treat it as the factual boundary.
- Do not invent missing architecture.
- Do not invent benchmarks.
- Do not invent successors.
- Do not invent production results.
- Do not add external claims unless the user explicitly requests research.
- Preserve the source’s uncertainty.
- Preserve contradictions instead of smoothing them away.

### Evidence Levels

Every important claim should mentally belong to one of four levels.

Level 1: Directly demonstrated.

The source contains an experiment, table, derivation, or explicit result.

Say:

“The paper reports…”

“The experiment shows…”

“In the HDFS benchmark…”

Level 2: Explicitly stated by the authors.

The source says it, but the evidence may be incomplete.

Say:

“The authors argue…”

“The paper concludes…”

“The report states…”

Level 3: Reasonable engineering inference.

The conclusion follows from the mechanism, but the paper did not directly test it.

Say:

“The engineering pattern we can take from this is…”

“A reasonable application is…”

“This suggests…”

Level 4: Unsupported.

The source does not justify it.

Do not include it as fact.

If it is relevant, say that it is not established.

### Grounded Is Not Validated

Always preserve this distinction.

Grounded means a claim genuinely appears in the source.

Validated means the evidence is strong enough to support the claim.

A quotation can prove that the authors made a claim.

It does not prove that the claim is universally true.

### Benchmark Containment

Never convert:

“Near one hundred percent accuracy on HDFS under clean block IDs”

into:

“Near one hundred percent accuracy in production.”

Always retain:

- Dataset.
- Training condition.
- Evaluation condition.
- Key dependency.
- Scope.
- Missing metrics when relevant.

### Contradictions

When the source contains conflicting evidence, state the conflict plainly.

Example:

“Telea wins on SSIM, LPIPS, and runtime in the reported numbers.

The authors still prefer LaMa qualitatively for complex backgrounds.

The paper does not resolve that disagreement with a combined or human-rated metric.”

Do not secretly choose one side.

### Successor Claims

Only call a paper a successor when the source explicitly establishes continuity through citation, method extension, or problem framing.

Do not call adjacent work a successor merely because it is newer or related.

### User Analysis Versus Paper Evidence

If the supplied material contains both paper facts and analyst commentary, keep them distinguishable.

Say:

“The paper demonstrates…”

“The transcript infers…”

“The applied lesson is…”

Do not merge all three into one factual voice.

## Research-Paper Transformation Framework

For each paper, answer the following.

### What Is It Trying to Solve?

Explain the actual operational problem.

Do not begin with model names.

### What Is the Simplest Mental Picture?

Use one concrete picture.

Examples:

- Logs as a sentence.
- A decision boundary that must be carefully reshaped.
- A video assembly line with specialized stations.

### What Goes In?

Explain the input representation.

Examples:

- Log keys and parameter vectors.
- Normal-only training data.
- Video frames, bounding boxes, masks, poses.

### What Happens?

Explain the mechanism in chronological order.

Avoid architecture dumps.

### What Comes Out?

Explain the prediction, transformed artifact, alert, or diagnosis.

### What Did the Paper Demonstrate?

Include:

- Dataset.
- Baseline.
- Metric.
- Important number.
- Experimental condition.

Only include numbers that matter.

### What Made the Result Possible?

Identify hidden dependencies.

Examples:

- Clean session IDs.
- Stable log-key vocabulary.
- Correct operator labels.
- Single dominant subject.
- Relatively clean video clips.

### What Does It Not Solve?

State the hard limit.

Examples:

- Log tampering.
- Parser drift.
- Noisy feedback.
- Multi-person scenes.
- Guaranteed temporal identity.
- Privacy guarantees.

### What Should an Applied Engineer Take?

Extract the reusable pattern, not the hype.

Examples:

- Model per-ID trajectories.
- Combine control-flow and metric anomalies.
- Use bounded incremental updates.
- Protect important memories during adaptation.
- Build modular pipelines.
- Run ablations under explicit metrics.
- Add quality gates between stages.

### What Must They Not Claim?

End with the strongest forbidden overclaim.

Example:

“Do not say DeepLog solved anomaly detection.”

“Do not say ByeBye proved video anonymization.”

## Low-Level to High-Level Progression

When the user requests low level to high level, follow this progression.

### Low Level

Explain the objects and operations.

Examples:

- What a log key is.
- What a parameter vector contains.
- What a false negative means.
- What a mask is.
- What inpainting does.

### Middle Level

Explain how the pieces cooperate.

Examples:

- How next-key prediction detects wrong execution paths.
- How bounded loss and memory regularization update a detector.
- How YOLO, SAM, LaMa, OpenPose, and ControlNet form a pipeline.

### High Level

Explain the transferable engineering pattern.

Examples:

- Correct data decomposition before model selection.
- Controlled adaptation after deployment.
- Modular composition under measured trade-offs.
- Assumptions at system boundaries determine reliability.

Never begin at the high level when the listener has not yet seen the mechanism.

## Applied AI Engineer Lens

The output should prioritize findings useful to an applied AI engineer.

Focus on:

- Data representation.
- Task decomposition.
- Training regime.
- Model role.
- Interface boundaries.
- Evaluation design.
- Runtime constraints.
- Failure propagation.
- Human feedback.
- Update mechanism.
- Production assumptions.
- What can be reused.
- What must be revalidated.

Do not spend time praising novelty unless it changes engineering decisions.

## Terminology and Bilingual Rules

Write in the user’s requested language.

For Vietnamese responses:

- Write naturally in Vietnamese.
- Keep English only for established technical keywords the user may need later.
- Explain each important English term once.
- After that, use the shorter term consistently.
- Do not alternate randomly between Vietnamese and English.
- Do not translate a term when the translation sounds unnatural or less precise.

Good:

“False negative là trường hợp anomaly thật bị model xem là bình thường.”

Afterward:

“Paper tập trung mạnh hơn vào false negative.”

Bad:

“Âm tính giả là khi hệ thống missed an anomaly trong normality boundary.”

### Acronyms

On first use:

1. Say the acronym.
2. Expand it.
3. Explain its job in one plain sentence.

Example:

“LSTM, viết đầy đủ là Long Short-Term Memory, là một loại mạng nơ-ron dùng để học dữ liệu có thứ tự.”

After that, use “LSTM”.

Do not define one acronym using several unexplained acronyms.

## Spoken Language Rules

The output should be natural when heard, not merely acceptable when read.

Use:

- Short, complete sentences.
- Natural pauses.
- Clear transitions.
- Repetition of the central model when useful.
- Concrete verbs.
- Direct cause and effect.

Avoid:

- Dense parentheses.
- Semicolons.
- Long bullet-like sentences.
- Multiple subordinate clauses.
- Decorative language.
- Empty enthusiasm.
- Academic filler.
- Repeated disclaimers.
- Saying the same idea three ways.

### Numbers

Read numbers naturally.

Examples:

- `1%` becomes “một phần trăm”.
- `0.1237` becomes “không phẩy một hai ba bảy”.
- `CFG = 9` becomes “CFG bằng chín”.
- `0.7` becomes “không phẩy bảy”.
- `182 ms/frame` becomes “một trăm tám mươi hai mili giây cho mỗi khung hình”.

Preserve important numbers exactly.

### Symbols

Convert symbols by meaning.

- `→` becomes “sau đó”, “đi tới”, or “dẫn đến”.
- `+` becomes “kết hợp với” or “cộng”, depending on meaning.
- `/` becomes “và”, “hoặc”, or a natural phrase.
- `>` becomes “lớn hơn”.
- `<` becomes “nhỏ hơn”.
- `≈` becomes “xấp xỉ”.
- `FP/FN` becomes “false positive và false negative” on first use.

Do not read punctuation mechanically.

## Markdown Removal Rules

Unless the user explicitly requests formatted notes, the transformed response should not sound like Markdown.

Convert:

- Headings into spoken transitions.
- Bullets into connected sentences.
- Tables into comparisons.
- Diagrams into flows.
- Code into behavior.
- Footnotes into evidence statements.
- Bold and italics into natural emphasis.
- Links into source references only when needed.

Do not read:

- Hash symbols.
- Asterisks.
- Pipes.
- Backticks.
- Table headers cell by cell.
- Citation syntax aloud.

## Tables and Metrics

Do not narrate a table mechanically.

Bad:

“Model. SSIM. LPIPS. Runtime. Telea. Zero point nine six four…”

Better:

“Telea đạt SSIM bằng không phẩy chín sáu bốn, LPIPS bằng không phẩy không năm bảy, và mất khoảng bốn mươi sáu mili giây cho mỗi khung hình.

LaMa Dilated có SSIM thấp hơn, LPIPS cao hơn, và chậm hơn.

Vì vậy, metric ủng hộ Telea, dù tác giả vẫn nhận xét LaMa nhìn tự nhiên hơn trên nền phức tạp.”

Always explain what the comparison means.

## Diagrams and Pipelines

Turn diagrams into chronological narration.

Example:

“YOLO tìm người.

SAM chuyển bounding box thành mask.

Telea hoặc LaMa tái tạo nền.

OpenPose lấy tư thế.

Stable Diffusion tạo nhân vật.

ControlNet giữ nhân vật theo đúng tư thế.

Cuối cùng, hệ thống ghép nhân vật trở lại nền.”

Do not name all tools in one breath.

## Analogies

Use at most one primary analogy per difficult concept.

The analogy must map cleanly.

Good:

“DeepLog xem log như một câu. Log key là từ. Những log trước tạo ngữ cảnh. Model dự đoán từ tiếp theo.”

Good:

“Unlearning giống như sửa một ranh giới trên bản đồ. Ta phải đẩy một điểm bị xếp nhầm sang phía bên kia mà không làm méo toàn bộ bản đồ.”

Good:

“ByeBye giống một dây chuyền. Mỗi trạm làm một việc. Lỗi ở trạm đầu có thể truyền đến mọi trạm sau.”

Stop using the analogy once the real mechanism is understood.

## Critical Evaluation Rules

Critical does not mean negative.

Critical means claims are proportionate to evidence.

For every impressive result, ask:

- Under what dataset?
- Under what assumptions?
- Compared with what?
- Which metric?
- What is missing?
- What breaks when conditions change?
- Is the result operationally meaningful?
- Does the paper measure the thing people may assume it measures?

Examples:

- Detection accuracy is not the same as production reliability.
- Lower temporal LPIPS is not guaranteed identity consistency.
- Visual replacement is not proven anonymization.
- Incremental learning is not safe when feedback can be wrong.
- A fixed vocabulary is not lifelong representation learning.

## Compression Without Dilution

Do not remove a finding merely because it is technical.

Instead, compress it through structure.

Bad compression:

“The paper improves learning and has some limitations.”

Good compression:

“The paper adds a conservative update for false negatives.

It uses bounded loss to prevent extreme gradients.

It shrinks the learning rate.

It protects an important memory set so the model does not destroy old knowledge.

But it still assumes operator labels are correct.”

Preserve mechanism and limitation.

Remove only redundant wording.

## Recall Ending

When the user needs retention, finish with a compact mental model.

For three-paper research material, use a pattern like:

“DeepLog learns the normal sequence.

Unlearning repairs the detector after a missed anomaly.

ByeBye assembles specialized vision models into a measured pipeline.

DeepLog depends on clean session IDs and trusted logs.

Unlearning depends on trusted feedback and stable representations.

ByeBye depends on clean single-subject scenes and cannot guarantee temporal identity or privacy.”

Keep the recall ending short enough to repeat from memory.

## Optional Learning Reinforcement

Only add these when the user asks to study, learn, review, or retain.

### Recall Questions

Ask five open questions.

Examples:

1. Why does DeepLog need a session identifier?
2. What is the difference between execution-path and parameter anomaly?
3. What does unlearning change after a false negative?
4. Why can Telea win metrics while LaMa looks better to humans?
5. Why does frame-by-frame generation fail to guarantee temporal coherence?

### Application Task

Give one concrete task.

Example:

“Choose one system you know. Define its sequence ID, event vocabulary, numerical signals, feedback channel, and one failure mode the detector would still miss.”

### Review Cadence

Recommend review after:

- One day.
- Three days.
- Seven days.
- Fourteen days.
- Thirty days.

Do not add study exercises when the user only wants a transformation.

## Handling Long Sources

For long material:

- Preserve source order when it supports comprehension.
- Split by paper, system, or major concept.
- Do not mix several papers into the same paragraph.
- Complete one conceptual arc before starting another.
- Use clean transitions.
- Do not silently omit sections.
- If full coverage cannot fit, stop at a clean boundary and name the exact remaining section.

Do not overwhelm the listener by delivering all detail at one level.

## Handling Updated Sources

When the user uploads an updated document:

- Treat the newest document as the primary source.
- Identify newly added papers, findings, metrics, or corrections.
- Integrate them into the story rather than appending a disconnected patch.
- Preserve prior conclusions only if still supported.
- Replace old claims when the update corrects them.
- Do not pretend the previous source and updated source are identical.

## Failure Modes to Avoid

Never do the following:

- Create an audio file when the user requested a TTS response.
- Create a text file unless explicitly requested.
- Narrate the transcript conversation instead of the task content.
- Start with a dense executive summary.
- Dump all terminology before intuition.
- Mix multiple papers too early.
- Use “production-ready” without operational evidence.
- Treat a paper’s wording as proof of universal truth.
- Hide contradictions.
- Invent missing successors.
- Invent architecture.
- Turn engineering inference into paper fact.
- Translate every technical word into unnatural Vietnamese.
- Preserve Markdown at the cost of listening flow.
- Compress until the mechanism disappears.
- Add so much criticism that the core contribution becomes unclear.
- Add so much praise that limitations disappear.

## Default Research Response Blueprint

Use this blueprint when no more specific format is requested.

“Có [number] paper cần hiểu.

Paper đầu tiên giải quyết…

Paper tiếp theo bổ sung…

Paper cuối cùng cho thấy…

Bắt đầu với paper đầu tiên.

[Concrete problem.]

[Simplest mental picture.]

[Input representation.]

[Mechanism in chronological order.]

[What was demonstrated.]

[Important dependency.]

[Hard limitation.]

[Applied finding.]

[Three-sentence verdict.]

Bây giờ chuyển sang paper tiếp theo…”

At the end:

“Bây giờ là bức tranh lớn.”

Then connect the papers through no more than three shared principles.

Finish with a short recall model.

## Final Quality Checklist

Before answering, verify all of the following.

- The result is a response, not an audio file.
- The narration can be followed while tired.
- The listener encounters one conceptual burden at a time.
- The explanation moves from concrete to mechanism to applied value.
- Each paper is completed before the next begins.
- The problem is explained before model names.
- Important English terms are explained once.
- Vietnamese and English are not mixed chaotically.
- Numbers and benchmark conditions remain accurate.
- Direct proof, author claim, engineering inference, and unsupported ideas are not merged.
- Contradictions remain visible.
- Grounded claims are not presented as universally validated.
- Applied findings are clear.
- Hard limitations are clear.
- No important section was silently removed.
- The final recall model is short enough to remember.
- The output sounds like a person teaching, not a document renderer reading Markdown.

## Canonical Standard

A successful response should leave the listener with this feeling:

“I understand what the system does.

I understand how it does it.

I know what the paper actually proved.

I know what it did not prove.

I know what I can reuse as an engineer.

And I can explain it again without the document.”
