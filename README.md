# AG Quota Manager

**Local-first quota dashboard for managing multiple Google accounts used with Antigravity.**

AG Quota Manager is a local dashboard for tracking quota status, account health, shared usage notes, refresh history, and recommended accounts across multiple Google accounts used with Google Antigravity.

It is designed to be safe by default: **no password storage, no cookie storage, no OAuth token storage, no AI proxy, and no automatic account rotation**.

---

## Table of Contents

- [Overview](#overview)
- [Problem](#problem)
- [Goals](#goals)
- [Non-Goals](#non-goals)
- [Core Concepts](#core-concepts)
- [Features](#features)
- [Recommended Account Setup](#recommended-account-setup)
- [How It Works](#how-it-works)
- [Security Model](#security-model)
- [Data Model](#data-model)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Acceptance Criteria](#acceptance-criteria)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Many users work with Antigravity through multiple Google accounts, especially when each account has its own AI plan and quota. Managing these accounts manually can become difficult when some accounts are used by the owner and some are shared with other people.

AG Quota Manager provides a local dashboard to help users answer questions like:

- Which account still has enough quota?
- Which account is almost exhausted?
- Which account should be avoided?
- Which account is shared with another person?
- When was the account quota last checked?
- Which account should be used next?

This project focuses on **visibility and decision support**, not automation abuse.

---

## Problem

When using multiple Google accounts with Antigravity, quota can change at different times and for different reasons:

- The user works on different coding tasks using different accounts.
- Some accounts may be shared with other people.
- Quota may decrease when another person uses the same account on another machine.
- The user may forget which account is safe to use.
- Manually checking every account is slow and error-prone.

A centralized local dashboard can reduce confusion while keeping the account setup safe.

---

## Goals

The main goal is to build a **local-first quota dashboard** that helps manage multiple Antigravity Google accounts safely.

The system should:

- Manage multiple Google accounts used with Antigravity.
- Track quota percentage and status per account.
- Track whether an account is shared with other people.
- Store quota history over time.
- Support manual quota updates.
- Optionally support semi-automatic refresh using separate local browser profiles.
- Recommend which account should be used next.
- Warn when quota data is stale.
- Export account and quota history data.
- Run locally by default.
- Avoid storing sensitive authentication data.

---

## Non-Goals

This project must **not** become an AI router, proxy, or account-rotation tool.

The system must not:

- Provide an OpenAI-compatible API endpoint.
- Proxy AI requests to Antigravity.
- Route prompts through multiple Google accounts.
- Automatically rotate accounts when quota is low.
- Bypass quota limits.
- Store Google passwords.
- Store Google cookies.
- Store OAuth refresh tokens.
- Store long-lived access tokens.
- Automatically log in to Google accounts.
- Expose the dashboard publicly by default.
- Modify Antigravity sessions.
- Send prompts or coding requests on behalf of the user.

---

## Core Concepts

### Account

An account represents one Google account used with Antigravity.

Each account can have:

- Nickname
- Email hint
- Plan type
- Chrome profile mapping
- Shared status
- Priority
- Notes
- Active/inactive status

### Quota Status

Quota status is the current known quota condition of an account.

Supported statuses:

| Status | Meaning |
|---|---|
| `Green` | Enough quota, safe to use |
| `Yellow` | Medium quota, use carefully |
| `Red` | Low or exhausted quota, avoid using |
| `Locked` | Temporarily limited or unavailable |
| `Unknown` | Quota could not be detected or has not been checked |

Default thresholds:

| Range | Status |
|---|---|
| More than 50% | Green |
| 20% to 50% | Yellow |
| Less than 20% | Red |
| 0% | Red / Empty |
| Unable to check | Unknown |

### Manual Update

Manual update is the safest mode. The user checks quota manually in Antigravity and enters the value into the dashboard.

Manual mode must always be available as a fallback.

### Semi-Auto Refresh

Semi-auto refresh allows the dashboard to check account quota by using existing local browser or Antigravity profile sessions.

This mode should:

- Use separate Chrome profiles per account.
- Check accounts one by one.
- Avoid storing authentication secrets.
- Fall back to manual update if refresh fails.

### Stale Data

Quota data becomes less reliable over time, especially if the account is shared.

Default stale data levels:

| Age | Label |
|---|---|
| 0–10 minutes | Fresh |
| 10–30 minutes | Maybe old |
| More than 30 minutes | Stale |
| More than 2 hours | Very stale |

---

## Features

### MVP Features

- Account CRUD
- Manual quota update
- Quota status badges
- Shared account notes
- Last checked timestamp
- Quota history
- Recommended account logic
- Stale data warning
- CSV export
- JSON export
- Local-only dashboard

### Phase 2 Features

- Map account to local Chrome profile
- Refresh one account
- Refresh all accounts
- Auto refresh interval
- Refresh error handling
- Session expired warning
- Keep old quota data if refresh fails

### Phase 3 Features

- Quota history chart
- Quota drop detection
- Fast-drain warning
- Daily summary
- Weekly summary
- Account ranking
- Advanced filters

### Phase 4 Features

- Optional local dashboard password
- Backup and restore
- Audit log
- Settings validation
- Local security checks
- Import/export account configuration

---

## Recommended Account Setup

The recommended setup is to create a separate Chrome profile for each Google account.

Example:

```text
Chrome Profile AG-01 → acc01@gmail.com
Chrome Profile AG-02 → acc02@gmail.com
Chrome Profile AG-03 → acc03@gmail.com
Chrome Profile AG-04 → acc04@gmail.com
Chrome Profile AG-05 → acc05@gmail.com
Chrome Profile AG-06 → acc06@gmail.com
Chrome Profile AG-07 → acc07@gmail.com
Chrome Profile AG-08 → acc08@gmail.com
```

A main Chrome profile may still contain multiple signed-in Google accounts for normal browsing, but it should not be used as the primary source for automated quota checks.

Reason:

- A profile with many Google accounts can cause account ambiguity.
- Google may use account indexes such as `authuser=0`, `authuser=1`, and `authuser=2`.
- A quota reader may accidentally check the wrong account.

Recommended rule:

> Use one dedicated Chrome profile per Antigravity account.

---

## How It Works

### Manual Mode

1. User opens Antigravity or the relevant quota screen.
2. User checks the quota of an account.
3. User enters quota into AG Quota Manager.
4. Dashboard updates account status.
5. Dashboard stores a history record.
6. Recommendation logic updates the suggested account.

### Semi-Auto Mode

1. User maps each account to a dedicated Chrome profile.
2. User clicks `Refresh` or `Refresh All`.
3. The app checks each mapped profile one by one.
4. If quota is detected, the app updates current status.
5. The app creates a history record.
6. If quota cannot be detected, the app records an error and keeps the previous known quota.

Semi-auto mode does **not** require the user to keep 8 browser tabs open all the time.

The only requirement is that the relevant local profile session is still valid.

---

## Security Model

Security is a core requirement of this project.

### Must Not Store Secrets

The application must not store:

- Google password
- Google cookie
- OAuth refresh token
- Access token
- 2FA code
- Recovery code
- Raw browser session
- Long-lived Antigravity secret token

### Local Only by Default

The app should bind to:

```text
127.0.0.1
localhost
```

The app must not bind to `0.0.0.0` by default.

### No Proxy

The app must not create endpoints such as:

```text
/v1/chat/completions
/v1/models
/v1/messages
```

The dashboard must not act as an AI request proxy.

### Read-Only Behavior

The app should only:

- Store account metadata.
- Store quota status.
- Store quota history.
- Read quota information where possible.
- Accept manual user input.

The app should not:

- Send prompts.
- Generate code through Antigravity.
- Switch accounts automatically.
- Modify Google account settings.
- Modify Antigravity sessions.

---

## Data Model

### Account

```ts
interface Account {
  id: string;
  nickname: string;
  emailHint?: string;
  plan: 'Free' | 'AI Pro' | 'AI Ultra' | 'Unknown';
  chromeProfileName?: string;
  chromeProfilePath?: string;
  isShared: boolean;
  sharedWith?: string;
  priority: number;
  isActive: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Quota Status

```ts
interface QuotaStatus {
  id: string;
  accountId: string;
  quotaPercent?: number;
  status: 'Green' | 'Yellow' | 'Red' | 'Locked' | 'Unknown';
  resetEstimate?: string;
  lastCheckedAt?: string;
  source: 'manual' | 'auto';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Quota History

```ts
interface QuotaHistory {
  id: string;
  accountId: string;
  quotaPercent?: number;
  status: 'Green' | 'Yellow' | 'Red' | 'Locked' | 'Unknown';
  resetEstimate?: string;
  source: 'manual' | 'auto';
  checkedAt: string;
  errorMessage?: string;
  note?: string;
  createdAt: string;
}
```

### Settings

```ts
interface Settings {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}
```

---

## Tech Stack

Recommended local web app stack:

```text
Frontend: Next.js / React
Backend: Next.js API routes or Express
Database: SQLite
Runtime: Node.js
Automation: Optional Playwright
Storage: Local only
```

Alternative desktop app stack:

```text
Frontend: React
Runtime: Tauri or Electron
Database: SQLite
Automation: Optional Playwright
Storage: Local only
```

Recommended MVP approach:

> Build a local web dashboard first, then add optional semi-auto refresh later.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm, pnpm, or yarn
- SQLite
- Chrome installed
- Antigravity installed and signed in with the target accounts

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ag-quota-manager.git
cd ag-quota-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

Open the dashboard:

```text
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file:

```env
APP_HOST=127.0.0.1
APP_PORT=3000
DATABASE_URL=file:./data/ag-quota-manager.db
DEFAULT_REFRESH_INTERVAL_MINUTES=10
```

Do not store Google account credentials in environment variables.

---

## Usage

### Add Accounts

Add each account with a nickname and optional email hint.

Example:

```text
Nickname: AG-01
Email hint: acc01@gmail.com
Plan: AI Pro
Chrome Profile: AG-01
Shared: No
Priority: 1
```

### Update Quota Manually

1. Open account details.
2. Click `Manual Update`.
3. Enter quota percent.
4. Add reset estimate if available.
5. Save.

### Refresh Account

If semi-auto refresh is enabled:

1. Make sure the mapped Chrome profile is signed in.
2. Click `Refresh` for one account.
3. Or click `Refresh All` for all active accounts.

### Use Recommendation

The dashboard should show the recommended account based on:

- Current quota
- Shared status
- Priority
- Last checked time
- Locked/unknown status

---

## Project Structure

Suggested structure:

```text
ag-quota-manager/
├── app/
│   ├── dashboard/
│   ├── accounts/
│   ├── history/
│   └── settings/
├── components/
│   ├── account-table.tsx
│   ├── quota-badge.tsx
│   ├── quota-history-chart.tsx
│   └── recommendation-card.tsx
├── lib/
│   ├── db.ts
│   ├── quota-status.ts
│   ├── recommendation.ts
│   ├── stale-data.ts
│   └── export.ts
├── automation/
│   ├── quota-reader.ts
│   └── chrome-profile.ts
├── prisma/
│   └── schema.prisma
├── data/
├── README.md
└── package.json
```

---

## Roadmap

### Phase 1: Manual MVP

- [ ] Account CRUD
- [ ] Manual quota update
- [ ] Quota status badges
- [ ] Shared account notes
- [ ] Last checked timestamp
- [ ] Quota history table
- [ ] Recommendation logic
- [ ] Stale data warning
- [ ] CSV export
- [ ] JSON export

### Phase 2: Semi-Auto Refresh

- [ ] Chrome profile mapping
- [ ] Refresh one account
- [ ] Refresh all accounts
- [ ] Auto refresh interval
- [ ] Refresh error handling
- [ ] Session expired warning
- [ ] Keep old quota after failed refresh

### Phase 3: Analytics

- [ ] Quota history chart
- [ ] Quota drop detection
- [ ] Fast-drain warning
- [ ] Daily summary
- [ ] Weekly summary
- [ ] Account ranking
- [ ] Shared account analysis

### Phase 4: Security Hardening

- [ ] Local-only binding check
- [ ] Optional local dashboard password
- [ ] Backup and restore
- [ ] Audit log
- [ ] Settings validation
- [ ] Secret storage prevention checks

---

## Acceptance Criteria

The MVP is complete when:

- [ ] User can add 8 or more accounts.
- [ ] Each account has nickname, plan, email hint, and profile mapping.
- [ ] User can manually update quota.
- [ ] Dashboard shows Green, Yellow, Red, Locked, or Unknown status.
- [ ] Dashboard stores quota history.
- [ ] Dashboard supports shared account notes.
- [ ] Dashboard recommends which account to use.
- [ ] Dashboard warns when quota data is stale.
- [ ] Dashboard exports CSV or JSON.
- [ ] App does not store passwords, cookies, or OAuth tokens.
- [ ] App runs locally on localhost.
- [ ] App does not expose AI proxy endpoints.

Phase 2 is complete when:

- [ ] Dashboard can refresh one account using its mapped Chrome profile.
- [ ] Dashboard can refresh all active accounts sequentially.
- [ ] One account refresh failure does not stop the whole refresh process.
- [ ] Dashboard records refresh errors clearly.
- [ ] Manual update remains available when auto refresh fails.

---

## Limitations

- This tool does not increase quota.
- This tool does not bypass account limits.
- This tool does not route prompts.
- This tool does not replace Antigravity account management.
- Semi-auto refresh may break if Antigravity or Google changes the quota display or internal behavior.
- Manual mode should always remain available.

---

## Contributing

Contributions should follow the security-first design of this project.

Do not submit features that:

- Store Google secrets.
- Add AI proxy endpoints.
- Add automatic account rotation.
- Attempt to bypass quota limits.
- Modify Antigravity sessions without explicit user action.

Preferred contributions:

- UI improvements
- Local data export/import
- Better history views
- Better recommendation logic
- Safer profile mapping
- Better error handling
- Documentation improvements

---

## License

MIT License.

---

## Final Design Principle

AG Quota Manager should remain a **safe local quota dashboard**.

It should help the user make better account usage decisions without becoming a proxy, router, or account automation tool.
