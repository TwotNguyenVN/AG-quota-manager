# AG Quota Manager — Full Project Specification for AI Agent

## 1. Project Name

**AG Quota Manager**

## 2. One-line Description

A local-first web dashboard for tracking quota across multiple Google accounts used with Antigravity IDE, inspired by 9Router-style local dashboards, but without AI proxying, account rotation, or secret storage.

## 3. Project Purpose

AG Quota Manager is a local web dashboard that helps the user manage and monitor quota across multiple Google accounts used with Antigravity IDE.

The user has multiple Google accounts with AI Pro plans. Some accounts are used only by the user, while some may be shared with other people. Because of that, account quota can decrease without the user noticing.

The goal of this project is to automatically check and display quota status for all configured accounts, show which account should be used next, keep quota history, detect unusual quota drops, and optionally expose quick quota status inside Antigravity IDE through an extension.

The project should work like a local dashboard similar in style to 9Router:

```text
Local web dashboard
Local API server
SQLite/local storage
Settings page
Status dashboard
Provider/account table
Import/export config
Dashboard running on localhost
```

However, this project is not an AI router.

## 4. Core Principle

The core feature is:

```text
Auto quota reader + Refresh All accounts
```

Manual update is only a fallback.

Do not build this project as a manual-only quota tracker. A manual-only dashboard is not useful enough for the user's real need.

## 5. What This Project Must Do

The app must:

```text
Run locally on the user’s computer
Open through localhost
Manage multiple Google accounts used with Antigravity
Map each account to a Chrome profile
Automatically refresh quota if possible
Refresh one account
Refresh all accounts
Show quota status for each account
Show session/account errors
Show recommended account to use
Store quota history
Detect fast quota drops
Support manual override as fallback only
Support settings
Support import/export config
Optionally support an Antigravity IDE extension
```

## 6. What This Project Must Not Do

The app must not:

```text
Act as an AI router
Proxy AI requests
Create OpenAI-compatible API endpoints
Forward prompts to any AI provider
Auto-rotate accounts
Bypass quota
Store Google passwords
Store Google cookies
Store OAuth refresh tokens
Store long-lived access tokens
Store raw browser session data
Expose the local API publicly
Bind to 0.0.0.0 by default
```

Forbidden endpoints:

```text
/v1/chat/completions
/v1/models
/proxy
/rotate
/account-switch
```

## 7. Target Architecture

```text
AG Quota Manager
├── Local Web Dashboard
│   ├── Dashboard Overview
│   ├── Account Management
│   ├── Chrome Profile Mapping
│   ├── Quota Status
│   ├── Refresh One
│   ├── Refresh All
│   ├── Auto Refresh
│   ├── Quota History
│   ├── Recommendation
│   ├── Analytics
│   ├── Settings
│   └── Import / Export
│
├── Local API Routes
│   ├── Accounts API
│   ├── Quota API
│   ├── Refresh API
│   ├── History API
│   ├── Recommendation API
│   ├── Settings API
│   ├── Config Import/Export API
│   └── Health API
│
├── SQLite Database
│   ├── accounts
│   ├── quota_status
│   ├── quota_history
│   ├── settings
│   └── audit_logs
│
├── Quota Reader
│   ├── Mock Reader
│   ├── Real Antigravity Reader
│   ├── Profile Detector
│   ├── Error Normalizer
│   └── Refresh Result Normalizer
│
└── Optional Antigravity IDE Extension
    ├── Status Bar
    ├── Quick Quota View
    ├── Recommended Account
    ├── Refresh Data Command
    └── Open Dashboard Command
```

## 8. Recommended Tech Stack

Use this stack for the main implementation:

```text
Next.js
React
TypeScript
SQLite
Prisma
Tailwind CSS
Node.js runtime
Local API routes
```

Decision:

```text
Use Prisma + SQLite.
```

Reason:

```text
Prisma is easier for AI agent coding.
Prisma schema is readable.
SQLite is enough for local-first storage.
The app only needs local data, not a remote database.
```

## 9. Localhost Requirement

The app should run at:

```text
http://localhost:3028
```

or:

```text
http://127.0.0.1:3028
```

The app must bind only to:

```text
127.0.0.1
localhost
```

Do not bind to:

```text
0.0.0.0
```

unless the user explicitly changes advanced settings.

## 10. Suggested Repository Structure

```text
ag-quota-manager/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── accounts/
│   │   └── page.tsx
│   ├── history/
│   │   └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── api/
│       ├── health/
│       ├── accounts/
│       ├── quota/
│       ├── history/
│       ├── recommendation/
│       ├── settings/
│       └── config/
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── accounts/
│   ├── quota/
│   ├── history/
│   ├── analytics/
│   └── ui/
│
├── lib/
│   ├── db/
│   │   └── prisma.ts
│   ├── services/
│   ├── quota-reader/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── mock-reader.ts
│   │   ├── antigravity-reader.ts
│   │   ├── profile-detector.ts
│   │   └── errors.ts
│   ├── recommendation/
│   ├── validators/
│   └── utils/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   ├── SECURITY.md
│   └── EXTENSION.md
│
├── README.md
├── package.json
├── .env.example
└── tsconfig.json
```

## 11. Required NPM Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:migrate
npm run db:studio
npm run db:seed
```

## 12. Database Schema

Use Prisma with SQLite.

### 12.1 Account

```prisma
model Account {
  id                String        @id @default(cuid())
  nickname          String
  emailHint         String?
  plan              String        @default("AI Pro")
  chromeProfileName String?
  chromeProfilePath String?
  browserType       String        @default("chrome")
  isShared          Boolean       @default(false)
  sharedWith        String?
  priority          String        @default("medium")
  isActive          Boolean       @default(true)
  note              String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  quotaStatus       QuotaStatus?
  quotaHistory      QuotaHistory[]
}
```

### 12.2 QuotaStatus

```prisma
model QuotaStatus {
  id              String   @id @default(cuid())
  accountId       String   @unique
  quotaPercent    Int?
  status          String   @default("unknown")
  resetEstimate   String?
  lastCheckedAt   DateTime?
  source          String   @default("unknown")
  errorCode       String?
  errorMessage    String?
  lastErrorAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  account         Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
}
```

### 12.3 QuotaHistory

```prisma
model QuotaHistory {
  id              String   @id @default(cuid())
  accountId       String
  quotaPercent    Int?
  status          String
  resetEstimate   String?
  source          String
  checkedAt       DateTime
  errorCode       String?
  errorMessage    String?
  note            String?
  createdAt       DateTime @default(now())

  account         Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
}
```

### 12.4 Setting

```prisma
model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}
```

### 12.5 AuditLog

```prisma
model AuditLog {
  id         String   @id @default(cuid())
  action     String
  entityType String
  entityId   String?
  metadata   String?
  createdAt  DateTime @default(now())
}
```

## 13. Required Enums

Use shared TypeScript constants.

```ts
export type QuotaStatus =
  | "green"
  | "yellow"
  | "red"
  | "locked"
  | "unknown"
  | "error";

export type QuotaSource =
  | "auto-reader"
  | "mock-reader"
  | "manual-override"
  | "extension-manual"
  | "import"
  | "unknown";

export type QuotaErrorCode =
  | "PROFILE_NOT_FOUND"
  | "ACCOUNT_NOT_LOGGED_IN"
  | "SESSION_EXPIRED"
  | "QUOTA_NOT_DETECTED"
  | "TIMEOUT"
  | "UNKNOWN_ERROR";

export type AccountPriority =
  | "high"
  | "medium"
  | "low";
```

## 14. Status Rules

Default quota thresholds:

```text
Green  → quota > 50%
Yellow → quota from 20% to 50%
Red    → quota < 20%
Red    → quota = 0%
Unknown → no quota data
Error → refresh failed
Locked → account is manually or automatically marked as locked
```

These thresholds must be configurable from Settings.

## 15. Quota Reader Types

The project must clearly separate reader types.

### 15.1 Mock Reader

Purpose:

```text
Used only for testing UI/API flow.
Does not read real quota.
Must not be treated as production completion.
```

Source:

```text
mock-reader
```

### 15.2 Real Antigravity Reader

Purpose:

```text
Read real quota from Antigravity/local account session if feasible.
Return quota percent/status/reset estimate.
Return normalized error if failed.
Must not store secrets.
Must not proxy requests.
```

Source:

```text
auto-reader
```

### 15.3 Manual Override

Purpose:

```text
Fallback only.
Used when real reader fails, account is logged out, or user wants to temporarily override status.
```

Source:

```text
manual-override
```

## 16. Quota Reader Interface

```ts
export type QuotaRefreshResult = {
  accountId: string;
  success: boolean;
  quotaPercent?: number;
  status: QuotaStatus;
  resetEstimate?: string;
  checkedAt: string;
  source: QuotaSource;
  errorCode?: QuotaErrorCode;
  errorMessage?: string;
};
```

## 17. Quota Reader Feasibility Spike

Before building advanced UI, the AI agent must create a feasibility spike for the real quota reader.

### Goal

Determine whether real Antigravity quota can be read safely.

### Tasks

```text
Find possible local quota source.
Check whether Antigravity exposes local status data.
Check whether the account quota can be read from a local endpoint, local file, or IDE state.
Check whether Chrome profile mapping can be used safely.
Do not store cookie/password/OAuth token.
Do not add proxy logic.
Build one prototype function that returns quota for one account if possible.
If not possible, return a clear limitation report.
```

### Completion Criteria

```text
The project has a mock reader.
The project has a real-reader interface.
The project has either:
- a prototype real reader, or
- a clear technical report saying real reader is not yet feasible.
Refresh All must not be considered complete if it only uses mock reader.
```

## 18. Critical Refresh Error Rule

This rule is mandatory.

When refresh fails:

```text
Do not delete previous quota.
Do not set quotaPercent to null.
Do not overwrite good quota data with empty data.
Do not mark the whole account as unusable unless the error is clear.
Only update errorCode, errorMessage, lastErrorAt, and source.
Always add a quota_history record for the failed refresh.
Show the old quota with a warning badge such as "Refresh error" or "Data may be stale".
```

Example:

```text
Before refresh:
AG-01 quota = 82%, status = green

Refresh result:
TIMEOUT

After refresh:
AG-01 still shows 82%, status = green
But also shows:
Refresh error: TIMEOUT
Data may be stale
```

## 19. API Contracts

### 19.1 Health API

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "status": "ok",
  "app": "AG Quota Manager",
  "version": "0.1.0",
  "timestamp": "2026-06-29T10:30:00.000Z"
}
```

### 19.2 Accounts API

```http
GET /api/accounts
```

Response:

```json
{
  "success": true,
  "accounts": []
}
```

```http
POST /api/accounts
```

Request:

```json
{
  "nickname": "AG-01",
  "emailHint": "acc01@gmail.com",
  "plan": "AI Pro",
  "chromeProfileName": "AG-01",
  "chromeProfilePath": "",
  "browserType": "chrome",
  "isShared": false,
  "sharedWith": "",
  "priority": "high",
  "note": "Main coding account"
}
```

Response:

```json
{
  "success": true,
  "account": {}
}
```

### 19.3 Quota Status API

```http
GET /api/quota/status
```

Response:

```json
{
  "success": true,
  "items": [
    {
      "accountId": "string",
      "nickname": "AG-01",
      "quotaPercent": 82,
      "status": "green",
      "resetEstimate": "3h",
      "lastCheckedAt": "2026-06-29T10:30:00.000Z",
      "source": "auto-reader",
      "errorCode": null,
      "errorMessage": null
    }
  ]
}
```

### 19.4 Refresh One API

```http
POST /api/quota/refresh-one
```

Request:

```json
{
  "accountId": "string",
  "reader": "auto-reader"
}
```

Success response:

```json
{
  "success": true,
  "result": {
    "accountId": "string",
    "quotaPercent": 82,
    "status": "green",
    "resetEstimate": "3h",
    "checkedAt": "2026-06-29T10:30:00.000Z",
    "source": "auto-reader"
  }
}
```

Error response:

```json
{
  "success": false,
  "result": {
    "accountId": "string",
    "status": "error",
    "checkedAt": "2026-06-29T10:30:00.000Z",
    "source": "auto-reader",
    "errorCode": "SESSION_EXPIRED",
    "errorMessage": "Account session expired. Please login again."
  }
}
```

### 19.5 Refresh All API

```http
POST /api/quota/refresh-all
```

Request:

```json
{
  "reader": "auto-reader",
  "onlyActive": true
}
```

Response:

```json
{
  "success": true,
  "summary": {
    "total": 8,
    "successCount": 6,
    "errorCount": 2,
    "skippedCount": 0,
    "startedAt": "2026-06-29T10:30:00.000Z",
    "finishedAt": "2026-06-29T10:31:00.000Z",
    "durationMs": 60000
  },
  "results": []
}
```

### 19.6 Manual Override API

```http
POST /api/quota/manual-override
```

Request:

```json
{
  "accountId": "string",
  "quotaPercent": 82,
  "status": "green",
  "resetEstimate": "3h",
  "note": "Manual fallback because reader failed"
}
```

Response:

```json
{
  "success": true,
  "result": {
    "accountId": "string",
    "quotaPercent": 82,
    "status": "green",
    "source": "manual-override"
  }
}
```

### 19.7 Recommendation API

```http
GET /api/recommendation
```

Response:

```json
{
  "success": true,
  "recommended": {
    "accountId": "string",
    "nickname": "AG-01",
    "quotaPercent": 82,
    "status": "green",
    "reason": "Quota is high, account is not shared, and data is fresh.",
    "warnings": []
  },
  "alternatives": []
}
```

### 19.8 History API

```http
GET /api/history
```

Query examples:

```text
/api/history?accountId=xxx
/api/history?source=auto-reader
/api/history?status=error
```

Response:

```json
{
  "success": true,
  "history": []
}
```

### 19.9 Settings API

```http
GET /api/settings
PUT /api/settings
```

Default settings:

```json
{
  "greenThreshold": 50,
  "redThreshold": 20,
  "staleMinutes": 30,
  "autoRefreshEnabled": false,
  "autoRefreshIntervalMinutes": 10,
  "confirmBeforeDelete": true,
  "confirmBeforeImportOverwrite": true,
  "auditLogEnabled": true
}
```

### 19.10 Export API

```http
GET /api/config/export
```

Export must include:

```text
accounts
quota_status
quota_history
settings
audit_logs
exported_at
app_version
```

Export must not include:

```text
password
cookie
OAuth token
access token
raw browser session
2FA code
recovery code
```

## 20. Recommendation Logic

Default rule:

```text
Quota > 50% + not shared + fresh data → highest priority
Quota > 50% + shared + fresh data → medium priority
Quota 20–50% → small tasks only
Quota < 20% → avoid
Quota = 0% → do not use
Locked → do not use
Unknown/Error → do not use
Stale data → refresh before using
```

Recommendation output must include:

```text
Recommended account
Reason
Warnings
Alternative accounts
Last checked age
```

Do not recommend:

```text
Red accounts
Locked accounts
Error accounts
Unknown accounts
Stale accounts if a fresh good account exists
```

## 21. Stale Data Rules

Default:

```text
Fresh      → checked within 10 minutes
Maybe old  → checked within 10–30 minutes
Stale      → checked more than 30 minutes ago
Very stale → checked more than 2 hours ago
```

Dashboard must show warning:

```text
Quota data may be stale. Refresh before using this account.
```

## 22. UI Requirements

### 22.1 Main Dashboard

Dashboard must show:

```text
Total accounts
Green accounts
Yellow accounts
Red accounts
Error accounts
Shared accounts
Stale accounts
Recommended account
Last refresh time
Refresh All button
Auto refresh status
```

### 22.2 Account Table

Columns:

```text
Account
Email hint
Profile
Plan
Quota
Status
Shared
Last checked
Reset estimate
Error
Actions
```

Actions:

```text
Refresh One
View History
Manual Override
Edit Account
Disable Account
Delete Account
```

### 22.3 Accounts Page

Must support:

```text
Add account
Edit account
Delete account
Enable/disable account
Set Chrome profile mapping
Set shared status
Set priority
Set note
```

### 22.4 History Page

Must show:

```text
Time
Account
Quota percent
Status
Source
Reset estimate
Error
Note
```

Filters:

```text
All accounts
By account
Today
Last 7 days
Last 30 days
Success only
Error only
Shared accounts
```

### 22.5 Settings Page

Must include:

```text
Green threshold
Red threshold
Stale data threshold
Auto refresh on/off
Refresh interval
Confirm before delete
Confirm before import overwrite
Audit log on/off
Theme optional
```

### 22.6 Import / Export Page

Must support:

```text
Export JSON
Import JSON
Preview import
Validate import
Confirm before overwrite
Reject secret-like fields
```

## 23. Phase Roadmap

## Phase 0 — Scope & Architecture Lock

Goal:

```text
Lock project scope, architecture, tech stack, and security rules.
```

Deliverables:

```text
README.md
ARCHITECTURE.md
ROADMAP.md
SECURITY.md
PROJECT_REQUIREMENTS.md
```

Completion criteria:

```text
Project is clearly defined as a local quota dashboard.
Refresh All is defined as core.
Manual update is defined as fallback only.
No proxy, no auto-rotation, no secret storage are clearly stated.
```

## Phase 0.5 — Quota Reader Feasibility Spike

Goal:

```text
Validate whether real quota can be read safely.
```

Tasks:

```text
Create quota-reader interface.
Create mock-reader.
Research real Antigravity quota source.
Try refresh-one prototype.
Document limitations if real reader is not feasible yet.
```

Completion criteria:

```text
Mock reader exists.
Real reader interface exists.
Feasibility result is documented.
No secret storage.
No proxy logic.
```

## Phase 1 — Next.js Local Dashboard Foundation

Goal:

```text
Create the basic local dashboard app.
```

Tasks:

```text
Create Next.js app.
Configure TypeScript.
Configure Tailwind or CSS Modules.
Create sidebar/topbar layout.
Create empty dashboard/accounts/history/settings pages.
```

Completion criteria:

```text
App runs locally.
Dashboard layout exists.
Navigation works.
```

## Phase 2 — SQLite Database & Prisma

Goal:

```text
Create local persistent storage.
```

Tasks:

```text
Install Prisma.
Configure SQLite.
Create schema.
Run migration.
Create Prisma client.
Seed demo accounts.
```

Completion criteria:

```text
SQLite works.
Migrations work.
No secret fields exist.
```

## Phase 3 — Local API Routes

Goal:

```text
Create local API routes for dashboard and future extension.
```

Tasks:

```text
Implement /api/health.
Implement /api/accounts CRUD.
Implement /api/quota/status.
Implement /api/quota/refresh-one.
Implement /api/quota/refresh-all.
Implement /api/quota/manual-override.
Implement /api/history.
Implement /api/recommendation.
Implement /api/settings.
Implement /api/config/export.
Implement /api/config/import.
```

Completion criteria:

```text
All required APIs return valid JSON.
No proxy endpoints exist.
Error responses are normalized.
```

## Phase 4 — Account & Chrome Profile Mapping

Goal:

```text
Allow the user to add accounts and map them to Chrome profiles.
```

Tasks:

```text
Build account form.
Build account table.
Add/edit/delete account.
Store Chrome profile name/path.
Store shared status and priority.
```

Completion criteria:

```text
User can create 8 accounts.
Each account can be mapped to a Chrome profile.
Data persists in SQLite.
```

## Phase 5 — Quota Reader Implementation

Goal:

```text
Implement the quota reader system.
```

Tasks:

```text
Implement mock-reader.
Implement real-reader skeleton.
Implement error normalization.
Implement reader selection.
Implement refresh result normalization.
```

Completion criteria:

```text
Mock reader works for testing.
Real reader has clear interface.
Real reader does not store secrets.
```

## Phase 6 — Refresh One Account

Goal:

```text
Refresh quota for one account.
```

Tasks:

```text
Build Refresh One API logic.
Build Refresh One UI button.
Save success result to quota_status.
Save every result to quota_history.
Follow no-overwrite-good-data rule on error.
```

Completion criteria:

```text
Refresh one account works.
Errors do not destroy previous quota.
History is recorded.
```

## Phase 7 — Refresh All Accounts

Goal:

```text
Refresh all active accounts with one action.
```

Tasks:

```text
Build Refresh All API.
Check accounts sequentially.
Continue when one account fails.
Return summary.
Show progress/loading state.
Show results table.
```

Completion criteria:

```text
Refresh All works.
One account error does not stop the process.
Summary is shown.
History is recorded for each account.
```

## Phase 8 — Auto Refresh Scheduler

Goal:

```text
Auto refresh quota on a safe interval.
```

Tasks:

```text
Add setting for auto refresh.
Add interval setting.
Implement scheduler in client/server-safe way.
Show last auto refresh.
Prevent too-frequent refresh.
```

Completion criteria:

```text
Auto refresh can be enabled/disabled.
Default interval is 5–10 minutes.
Errors do not crash app.
```

## Phase 9 — Status Dashboard

Goal:

```text
Build a dashboard similar to a local status page.
```

Tasks:

```text
Dashboard cards.
Quota summary.
Account status table.
Error badges.
Stale badges.
Recommended account panel.
```

Completion criteria:

```text
User can quickly see all account status.
Quota, errors, and recommendation are visible.
```

## Phase 10 — Recommendation Engine

Goal:

```text
Recommend the best account to use.
```

Tasks:

```text
Implement recommendation scoring.
Exclude red/locked/error/unknown accounts.
Prefer fresh data.
Prefer non-shared accounts.
Return reason and warnings.
```

Completion criteria:

```text
Recommendation API works.
Dashboard displays recommendation.
Reason is clear.
```

## Phase 11 — Quota History & Analytics

Goal:

```text
Store history and detect unusual usage.
```

Tasks:

```text
History page.
History filters.
Quota drop detection.
Fast drain warning.
Repeated error detection.
Shared account drop warning.
```

Completion criteria:

```text
History is visible.
Quota drops can be detected.
Warnings are shown without spam.
```

## Phase 12 — Manual Override / Fallback

Goal:

```text
Allow manual quota update only as fallback.
```

Tasks:

```text
Manual override form.
Manual override API.
History source = manual-override.
Clear UI label that this is fallback.
```

Completion criteria:

```text
Manual override works.
Auto reader remains the core path.
```

## Phase 13 — Settings Page

Goal:

```text
Allow user configuration.
```

Tasks:

```text
Threshold settings.
Auto refresh settings.
Stale data settings.
Confirm dangerous actions.
Audit log toggle.
```

Completion criteria:

```text
Settings persist in SQLite.
Dashboard uses new settings.
```

## Phase 14 — Import / Export Config

Goal:

```text
Support backup and restore.
```

Tasks:

```text
Export JSON.
Import JSON.
Validate schema.
Reject secret-like fields.
Preview import.
Confirm overwrite.
```

Completion criteria:

```text
Export/import works safely.
No secrets are exported/imported.
```

## Phase 15 — Security Hardening

Goal:

```text
Make app safe for long-term local use.
```

Tasks:

```text
Ensure local-only binding.
Add SECURITY.md.
Add audit logs.
Remove any proxy-like endpoints.
Scan schema for secret fields.
Confirm no cookie/token/password storage.
```

Completion criteria:

```text
No secret storage.
No proxy.
No auto rotation.
Local-only.
Audit log works.
```

## Phase 16 — Optional Antigravity IDE Extension

Goal:

```text
Show quick quota info inside Antigravity IDE.
```

Extension features:

```text
Status bar quota summary
Sidebar account list
Recommended account
Refresh data command
Open dashboard command
Offline status if local API is down
```

Extension API calls:

```text
GET /api/health
GET /api/quota/status
GET /api/recommendation
POST /api/quota/refresh-all
```

Completion criteria:

```text
Extension builds.
Extension does not store secrets.
Extension reads from local API.
Extension does not replace dashboard.
```

## Phase 17 — Packaging & Release

Goal:

```text
Make the project easy to run.
```

Tasks:

```text
README.md
INSTALL.md
USAGE.md
SECURITY.md
CHANGELOG.md
Build scripts
Seed data
Optional .vsix package if extension exists
```

Completion criteria:

```text
User can install and run app locally.
Docs are clear.
```

## Phase 18 — Maintenance

Goal:

```text
Keep the app stable.
```

Principles:

```text
Auto quota reader is core.
Refresh All is core.
Manual fallback must never be removed.
SQLite is source of truth.
No secret storage.
No proxy.
No auto-rotation.
Local-first.
User remains in control.
Extension is optional.
```

## 24. MVP Definition

MVP must include:

```text
Next.js local dashboard
SQLite + Prisma
Local API routes
Account/Profile mapping
Quota reader interface
Mock reader
Real reader feasibility spike
Refresh One
Refresh All
Quota status table
Error handling
Recommendation
Quota history
Manual fallback
Settings basics
Export JSON
Security notes
No secret storage
No proxy
No auto-rotate
```

MVP does not need:

```text
Antigravity extension
Desktop packaging
Cloud sync
Multi-user server
Advanced analytics
Perfect real quota reader if feasibility is not yet proven
```

Important:

```text
Mock reader alone is not considered full completion.
The project must clearly mark mock reader as test/demo only.
```

## 25. Implementation Rules for AI Agent

The AI agent must follow these rules:

```text
1. Build this as a local dashboard, not an AI router.
2. Use Next.js + React + TypeScript + Prisma + SQLite.
3. Use SQLite as the source of truth.
4. Build Local API routes before complex UI.
5. Build quota-reader interface early.
6. Build mock-reader only for UI/API testing.
7. Do not treat mock-reader as production reader.
8. Add a quota reader feasibility spike.
9. Refresh All is the main feature.
10. Manual override is fallback only.
11. Never store password/cookie/OAuth token/access token/raw session.
12. Never create proxy or OpenAI-compatible endpoints.
13. Never implement account rotation.
14. Never overwrite good quota with failed refresh data.
15. Always write quota history for refresh attempts.
16. Always normalize reader errors.
17. Add audit logs for important changes.
18. Keep app local-only.
19. Extension is optional and must read from Local API.
20. Do not build extension before the web dashboard and API are stable.
```

## 26. Task Order for AI Agent

Recommended task order:

```text
1. Create Next.js project.
2. Configure TypeScript.
3. Configure Prisma + SQLite.
4. Create Prisma schema.
5. Run first migration.
6. Create Prisma client helper.
7. Create shared enums/types.
8. Create /api/health.
9. Create account CRUD APIs.
10. Create quota status API.
11. Create quota-reader interface.
12. Create mock-reader.
13. Create real-reader skeleton.
14. Create refresh-one API.
15. Create refresh-all API.
16. Implement no-overwrite-good-data rule.
17. Create quota history API.
18. Create recommendation logic/API.
19. Create settings API.
20. Create export/import API.
21. Build dashboard layout.
22. Build account/profile mapping UI.
23. Build quota status table.
24. Build Refresh One button.
25. Build Refresh All button.
26. Build loading/success/error states.
27. Build recommendation panel.
28. Build history page.
29. Build settings page.
30. Build manual override fallback.
31. Build import/export UI.
32. Add audit logs.
33. Add SECURITY.md.
34. Add README/INSTALL/USAGE.
35. Add quota reader feasibility report.
36. Only then consider extension.
```

## 27. Acceptance Criteria

The project is ready for first usable MVP when:

```text
User can run the app on localhost.
User can add 8 accounts.
User can map each account to a Chrome profile.
User can click Refresh One.
User can click Refresh All.
Refresh errors are shown per account.
Refresh All continues even if one account fails.
Quota status is stored in SQLite.
Quota history is stored in SQLite.
Recommendation is shown.
Manual override exists only as fallback.
Settings are saved.
Export JSON works.
No password/cookie/token fields exist.
No proxy endpoint exists.
No account rotation exists.
Security notes are documented.
```

## 28. Final Direction

The final direction is:

```text
Next.js + React
Local API routes
SQLite + Prisma
Dashboard localhost
Quota reader
Refresh all accounts
Manual fallback
Optional Antigravity extension
```

The project should be similar to 9Router only in these parts:

```text
Local dashboard
Local API server
SQLite/local storage
Settings
Status dashboard
Account/provider table
Import/export config
```

The project must not copy these parts:

```text
Proxy
AI routing
Auto fallback provider
Auto account rotation
Token/cookie storage
Quota bypass
```

## 29. Final Summary

AG Quota Manager is a local-first quota management dashboard for multiple Google accounts used with Antigravity IDE.

The app must automatically check quota when possible, provide Refresh One and Refresh All, store quota status/history in SQLite, recommend the best account to use, and avoid all risky router/proxy behavior.

Core rule:

```text
Tool must check quota automatically.
Refresh All is the main value.
Manual update is fallback only.
No proxy.
No auto-rotate.
No secret storage.
```
