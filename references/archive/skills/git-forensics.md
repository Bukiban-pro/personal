# git-forensics

Deploy when: need to find when/why a bug was introduced, trace regressions, understand code evolution.

## Formula

```
git blame <file> → find the commit that introduced a suspicious line
git log --oneline <path> → trace file evolution across branches
git bisect start → binary search for the commit that broke something
git log --all --grep=<pattern> → find commits by message or issue ID
git diff <tag1>..<tag2> -- <path> → see what changed between releases
git log --oneline --graph --all → visual branch topology
```

## Prompts

**Bug attribution:**
```
"Given file <path> and bug description <X>, blame the file, read the suspect
commits, and identify the most likely culprit. Output: commit hash, author,
date, and why the change introduced the bug."
```

**Release diff:**
```
"Summarize behavior changes from tag <v1.2.0> to <v1.3.0>. Group by module.
Flag any diff that touches error handling, state management, or serialization."
```

**Commit archeology:**
```
"This repo has a regression in <feature>. Search commit messages for keywords
related to this feature. For each match, show the diff stat and the full
commit message. I want to know when this feature last worked correctly."
```

## Artifacts
- `git-forensics-report.md` — commit hash, author, date, root cause, fix plan.
