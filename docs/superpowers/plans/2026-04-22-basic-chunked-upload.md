# Basic Chunked Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fragile single-request browser upload flow with a basic chunked upload flow that stores chunks on the local filesystem and assembles them server-side before creating the publication record.

**Architecture:** The frontend creates an upload session, sends each selected file in fixed-size chunks, then asks the API to finalize the session. The backend stores chunk files in a temporary session directory, concatenates them into the existing upload storage directory on completion, reuses the existing publication persistence path, and then removes the temporary session data.

**Tech Stack:** React, TypeScript, TanStack Query, NestJS, Prisma, local filesystem storage, Jest e2e tests, Vitest

---

### Task 1: Add failing API e2e coverage for chunked upload

**Files:**
- Modify: `apps/api/test/publication-workflow.e2e-spec.ts`

- [ ] Add a new e2e test for `POST /publications/upload/init`, per-chunk upload requests, and `POST /publications/upload/:uploadId/complete`.
- [ ] Verify the test fails because the endpoints do not exist yet.

### Task 2: Add backend DTOs and chunk session storage helpers

**Files:**
- Create: `apps/api/src/modules/publications/dto/init-chunk-upload.dto.ts`
- Create: `apps/api/src/modules/publications/dto/complete-chunk-upload.dto.ts`
- Create: `apps/api/src/modules/publications/chunk-upload-storage.ts`

- [ ] Define validated DTOs for upload-session init and completion.
- [ ] Add filesystem helpers for chunk session directories, manifest persistence, and cleanup.

### Task 3: Implement backend chunk upload endpoints and finalization

**Files:**
- Modify: `apps/api/src/modules/publications/publications.controller.ts`
- Modify: `apps/api/src/modules/publications/publications.service.ts`

- [ ] Add upload-session init endpoint.
- [ ] Add chunk upload endpoint that streams request data to a chunk file.
- [ ] Add completion endpoint that assembles final files and reuses existing publication creation logic.
- [ ] Clean temporary session files after completion.

### Task 4: Add failing frontend behavior coverage for chunk helper logic

**Files:**
- Create: `apps/web/src/lib/chunk-upload.test.ts`

- [ ] Add a focused test for chunk count / chunk slicing / progress calculation helpers.
- [ ] Verify the test fails before helper implementation.

### Task 5: Implement frontend chunked upload client and UI integration

**Files:**
- Create: `apps/web/src/lib/chunk-upload.ts`
- Modify: `apps/web/src/lib/api.ts`
- Modify: `apps/web/src/pages/upload-page.tsx`

- [ ] Implement client helpers for upload init, sequential chunk uploads, and completion.
- [ ] Wire the upload page to use the new helper instead of a single `FormData` request.
- [ ] Show upload progress and preserve existing success/error behavior.

### Task 6: Verify and clean up

**Files:**
- Modify only as needed from prior tasks.

- [ ] Run API e2e tests covering publication workflow.
- [ ] Run frontend tests.
- [ ] Run diagnostics/build checks on changed areas.
- [ ] Fix any regressions without expanding scope.
