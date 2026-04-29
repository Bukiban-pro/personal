# GEMINI.md: Project Context

This file provides a comprehensive overview of the `chefkix-fe` project for our collaborative sessions. It outlines the project's purpose, technologies, and development conventions.

## 1. Project Overview

`chefkix-fe` is a frontend application built with **Next.js 15** and **React 19** using **TypeScript**. Its core feature is to "gamify" cooking recipes. Users can paste raw recipe text, which is then sent to a backend service to be transformed into an interactive, step-by-step cooking game, complete with timers and badges.

### Key Technologies

- **Framework**: Next.js 15 (with App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Development Server**: Turbopack (as indicated by the `dev` script)
- **Styling**: Tailwind CSS
- **API Communication**: Axios

### Architecture

The project follows a structured source directory (`src/`) approach:

- **`src/app`**: Contains the application's routes and UI, following the Next.js App Router paradigm.
- **`src/services`**: A dedicated layer for making API calls (e.g., `auth.ts`). This is excellent for separating business logic from UI components.
- **`src/lib`**: Contains shared libraries and utilities, such as the pre-configured Axios instance (`axios.ts`) and TypeScript types (`types.ts`).
- **`src/configs`**: Holds centralized application configuration (e.g., `app.ts`).

## 2. Building and Running

The following scripts are available in `package.json`:

- **`npm run dev`**: Starts the development server with Turbopack at `http://localhost:3000`.
- **`npm run build`**: Creates a production-ready build of the application.
- **`npm run start`**: Starts the production server. Requires a build to have been run first.
- **`npm run lint`**: Runs the Next.js ESLint checker to identify code quality issues.
- **`npm run format`**: Formats all project files using Prettier.

## 3. Development Conventions

- **Code Style**: The project uses **Prettier** for automated code formatting to ensure consistency. The configuration is in `.prettierrc`.
- **Linting**: **ESLint** is configured via `eslint.config.mjs` using the recommended Next.js configuration.
- **Git Workflow**:
  - **Branching**: All new work is done on feature branches, typically prefixed with `feat/` or `fix/` (e.g., `feat/project-setup-and-auth`).
  - **Commits**: We use the **Conventional Commits** specification for clear and descriptive commit messages (e.g., `feat: ...`, `fix: ...`, `chore(dev): ...`).
- **API Backend**: The application communicates with a backend service expected to be running at `http://localhost:8080`.

## 4. Development Progress

### Initial Setup (Complete)

- **Workflow Established**: A professional `Branch -> Develop -> Test -> Commit -> Merge -> Clean Up` cycle is in place.
- **Quality Gates**: The project is configured with `husky` to run `prettier` (formatting) and `eslint` (linting) as pre-commit hooks, ensuring code quality.
- **Project Structure**: Standard directories (`tests/`, `docs/`) and documentation (`CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`) have been created.

### Architectural Refactor & Robust Authentication (Complete)

- **Centralized Architecture**: Professionalized the project structure by moving all application-wide constants (e.g., navigation paths, API endpoints) into a dedicated `src/constants` directory, eliminating "magic strings" and creating a single source of truth.
- **Custom Hook Abstraction**: Introduced a `useAuth` hook to act as the single, clean interface for interacting with the authentication state, abstracting away direct component-level dependency on the Zustand store.
- **Persistent & Validated Sessions**: Implemented a truly robust authentication flow:
  - **State Persistence**: Integrated Zustand's `persist` middleware to save the auth state in `localStorage`, ensuring the user's session survives page reloads.
  - **Server-Side Validation**: Built a sophisticated `AuthProvider` component that performs a one-time, on-load validation of the stored token against a backend `/api/auth/introspect` endpoint.
  - **Loading State Management**: The `AuthProvider` now manages a global `isLoading` state, preventing page flashes and ensuring redirects only happen after session validity is confirmed.
- **Configuration Correction**: Uncovered and fixed a critical project setup issue by generating the missing `tailwind.config.js` file, enabling future UI and theme customization.

### OTP Verification (Complete)

- **Enhanced Sign-Up Flow**: Modified the sign-up process to include a mandatory email verification step, enhancing account security.
- **Verification Page**: Created a new page and component at `/auth/verify-otp` where users can submit the one-time password sent to their email.
- **Extended Auth Service**: Added `sendOtp` and `verifyOtp` functions to the `auth.ts` service to handle the new backend endpoints.
- **Unit Test Coverage**: Implemented Jest unit tests for the new OTP service functions, ensuring their reliability and correct error handling.

### Structural Refactoring (Complete)

- **Component Co-location**: Moved authentication-related components (`SignInForm`, `SignUpForm`, `VerifyOtpForm`) from their nested locations within the `app` directory to a centralized `src/components/auth` directory. This improves separation of concerns and makes components more discoverable and reusable.
- **Type Definition Restructuring**: Split the monolithic `src/lib/types.ts` file into a more organized `src/lib/types` directory. This new structure includes `auth.ts` for authentication-specific DTOs, `common.ts` for generic types, and an `index.ts` for central exports, enhancing scalability and maintainability.

### Continuous Integration (CI) (Complete)

- **GitHub Actions Workflow**: A basic CI workflow has been implemented using GitHub Actions, configured to run on pushes to `main` and on pull requests targeting `main`.
- **Automated Checks**: The workflow includes steps for checking out code, setting up Node.js, installing dependencies, linting, **type checking**, **unit testing**, and building the project.

### Pre-commit Hooks (Complete)

- **Husky Enhancements**: The `.husky/pre-commit` hook has been updated to automatically stage files modified by the formatter, ensuring consistent code style before commits.

### Unit Testing (Complete)

- **Jest & React Testing Library Setup**: Integrated Jest as the testing framework and React Testing Library for component testing.
- **Auth Service Tests**: Implemented comprehensive unit tests for `signIn` and `signUp` functions in `src/services/auth.ts`, covering both success and failure scenarios.

### Secure Environment Variables (dotenvx) (Complete)

- **dotenvx Integration**: Implemented `dotenvx` for secure environment variable management, including encryption of `.env` files and secure injection of `DOTENV_PRIVATE_KEY` in CI.

### State Management (Zustand) (Complete)

- **Zustand Integration**: Integrated Zustand for client-side state management, starting with an authentication store.

### UI Components (shadcn/ui) (Complete)

- **shadcn/ui Setup**: Initialized and configured shadcn/ui.
- **Core Components Added**: Added Button, Input, and Form components from shadcn/ui.

### Google OAuth Integration (Frontend Ready, Backend Pending)

- **Frontend Setup**: Integrated `@react-oauth/google` library. Updated `GoogleSignInButton.tsx` to use `useGoogleLogin` with `flow: 'auth-code'` to obtain the authorization code. Configured `GoogleOAuthProvider` in `src/app/layout.tsx`. Added `GoogleSignInDto` type and `googleSignIn` service function to send the authorization code to the backend.
- **Current Status**: Frontend is ready to send the authorization code to the backend's `/api/auth/google` endpoint.
- **Pending Action**: Awaiting backend adjustment to accept the authorization code in the request body instead of direct `idToken`, `accessToken`, and `refreshToken`. This is crucial for adhering to OAuth 2.0 best practices and security.

