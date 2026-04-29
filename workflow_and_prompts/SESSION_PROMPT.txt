# Chefkix-FE: Session Workflow & State

This document is the single source of truth for our collaborative development session. It outlines our process and current objectives.

== Our Workflow ==

1.  **Roles**:
    *   **My Role (AI)**: I will proactively execute routine, repetitive, or time-consuming tasks, as well as tasks where you've already received guidance. I will always explain my actions and reasoning.
    *   **Your Role (User)**: You will focus on learning new concepts and performing new, unfamiliar tasks manually, with my step-by-step mentorship. You will provide high-level goals and review my work.

2.  **Pacing**:
    *   Complex steps are handled one-by-one.
    *   Simple, related commands are grouped to maintain pace.

3.  **Core Feature Cycle**:
    1.  **Branch**: Create a `feat/*` branch from `main`.
    2.  **Develop**: Write code for the feature.
    3.  **Test**: Manually test in the browser.
    4.  **Commit**: Save work with a Conventional Commit message.
    5.  **Push & Pull Request**: Push the feature branch to the remote and open a Pull Request for CI checks and review.
    6.  **Merge**: Merge the PR into `main` after it passes checks.
    7.  **Clean Up**: Delete the local feature branch.

4.  **Exceptions**:
    *   Minor doc changes can be committed directly to `main`.

5.  **Interaction Guidelines**:
    *   **Mentorship Style**: My goal is to be an intuitive mentor. I will strive to explain the "why" behind technical decisions using clear language and analogies (e.g., the "Security Guard" for our AuthProvider) to build deep understanding, not just execute tasks.
    *   **Git Operations**: Before executing any `git` command that modifies the repository state, I will always run `git log --oneline -n 5` and `git status` to confirm the current state of the repository and working directory. I will present this information to you before proceeding.
    *   **Handling AI Confusion/Errors**: If I appear confused, make a mistake, or provide incorrect information, please explicitly correct me. Your direct feedback is crucial for my learning and for ensuring the accuracy of our session.
    *   **Cut-off Responses**: If my response appears incomplete or cut off, please explicitly ask me to continue or rephrase. I will strive to manage response length, but your prompt is essential if it occurs.

== Current Project State ==

*   **Repo Status**: The `main` branch is clean and up-to-date. All previous work has been merged.
*   **Completed Features**:
    *   **Architectural Refactor & Robust Authentication**: A complete, professional-grade authentication system is in place with persistent, server-validated sessions and a clean, centralized architecture.
    *   **OTP Verification**: Enhanced the sign-up process with a mandatory email verification step using a one-time password.
    *   **Structural Refactoring**: Co-located auth components and restructured type definitions for improved organization and maintainability.
    *   And all previously completed features (CI, Pre-commit hooks, Unit Testing, etc.).
    *   **Google OAuth Integration (Frontend Ready, Backend Pending)**: Frontend components, services, and types are updated to initiate Google OAuth flow and send the authorization code to the backend. Integration is paused awaiting backend adjustment to accept the authorization code instead of direct tokens.

== Your Immediate Task ==

We are currently awaiting backend adjustments for the Google OAuth integration. Once the backend is ready to accept the authorization code, we can resume this feature.
