# AG Quota Manager — Phase Roadmap

## 1. Mục tiêu của tài liệu

File `Phase.md` mô tả lộ trình phát triển dự án **AG Quota Manager** theo từng phase.

Dự án là một **local-first web dashboard** dùng để quản lý và theo dõi quota của nhiều Google account đang sử dụng với Antigravity IDE.

Dự án lấy cảm hứng từ phong cách local dashboard của 9Router ở các phần:

```text
Local web dashboard
Local API server
SQLite/local storage
Settings page
Status dashboard
Provider/account table
Import/export config
Dashboard chạy bằng localhost
```

Nhưng dự án **không phải AI router**.

Dự án không được làm:

```text
Không proxy AI request
Không tạo OpenAI-compatible endpoint
Không auto-rotate account
Không bypass quota
Không lưu Google password
Không lưu Google cookie
Không lưu OAuth refresh token
Không lưu access token dài hạn
Không lưu raw browser session
Không gửi prompt thay người dùng
```

Nguyên tắc chính:

```text
Auto quota reader + Refresh All là chức năng chính.
Manual update chỉ là fallback.
Mock reader chỉ dùng để test UI/API flow.
```

---

# 2. Tổng quan phase

```text
Phase 0   → Scope & Architecture Lock
Phase 0.5 → Quota Reader Feasibility Spike
Phase 1   → Next.js Local Dashboard Foundation
Phase 2   → SQLite Database & Prisma
Phase 3   → Local API Routes
Phase 4   → Account & Chrome Profile Mapping
Phase 5   → Quota Reader System
Phase 6   → Refresh One Account
Phase 7   → Refresh All Accounts
Phase 8   → Auto Refresh Scheduler
Phase 9   → Status Dashboard
Phase 10  → Recommendation Engine
Phase 11  → Quota History & Analytics
Phase 12  → Manual Override / Fallback
Phase 13  → Settings Page
Phase 14  → Import / Export Config
Phase 15  → Security Hardening
Phase 16  → Optional Antigravity IDE Extension
Phase 17  → Packaging & Release
Phase 18  → Maintenance
```

Thứ tự ưu tiên:

```text
Local dashboard foundation
→ SQLite + Prisma
→ Local API routes
→ Account/Profile mapping
→ Quota reader interface
→ Mock reader
→ Real reader feasibility spike
→ Refresh One
→ Refresh All
→ Auto Refresh
→ Status Dashboard
→ Recommendation
→ History/Analytics
→ Manual Fallback
→ Settings
→ Import/Export
→ Security
→ Optional Extension
```

---

# Phase 0 — Scope & Architecture Lock

## Mục tiêu

Chốt rõ phạm vi, kiến trúc, công nghệ và nguyên tắc bảo mật của dự án trước khi code.

## Việc cần làm

```text
Chốt tên dự án: AG Quota Manager
Chốt mô tả dự án
Chốt kiến trúc: Next.js + React + Prisma + SQLite
Chốt app chạy local bằng localhost
Chốt SQLite là source of truth
Chốt Refresh All là core feature
Chốt Manual Override chỉ là fallback
Chốt không proxy
Chốt không auto-rotate account
Chốt không lưu secret
```

## Deliverables

```text
README.md
Plan.md
Phase.md
.agents/instructions.md
.agents/coding-rules.md
.agents/safety-rules.md
```

## Điều kiện hoàn thành

```text
Repo có README ngắn gọn.
Repo có Plan.md là specification chính.
Repo có Phase.md là roadmap.
Repo có rule cho AI agent.
Tài liệu ghi rõ app không phải AI router.
Tài liệu ghi rõ app không lưu password/cookie/OAuth token.
Tài liệu ghi rõ Refresh All là tính năng chính.
```

---

# Phase 0.5 — Quota Reader Feasibility Spike

## Mục tiêu

Kiểm tra xem có thể đọc quota thật của Antigravity/local account một cách an toàn hay không.

Đây là phase rất quan trọng. Không được coi dự án hoàn thành nếu chỉ có mock reader.

## Việc cần làm

```text
Tạo quota-reader interface.
Tạo mock-reader để test UI/API flow.
Nghiên cứu nguồn quota thật của Antigravity.
Kiểm tra Antigravity có local state/local endpoint/local file nào chứa quota không.
Kiểm tra Chrome Profile mapping có giúp đọc quota an toàn không.
Tạo prototype refresh-one cho 1 account nếu khả thi.
Nếu chưa khả thi, viết report rõ ràng.
```

## Không được làm

```text
Không lưu cookie.
Không lưu password.
Không lưu OAuth refresh token.
Không lưu access token dài hạn.
Không đọc raw browser session để lưu vào DB.
Không tạo proxy endpoint.
Không route request qua app.
Không auto-rotate account.
```

## Deliverables

```text
lib/quota-reader/types.ts
lib/quota-reader/mock-reader.ts
lib/quota-reader/antigravity-reader.ts
lib/quota-reader/errors.ts
docs/QUOTA_READER_FEASIBILITY.md
```

## Điều kiện hoàn thành

```text
Có quota reader interface.
Có mock reader để test.
Có real reader skeleton.
Có report khả thi/không khả thi.
Nếu chưa đọc được quota thật, phải ghi rõ mock reader chỉ là demo/test.
```

---

# Phase 1 — Next.js Local Dashboard Foundation

## Mục tiêu

Tạo nền tảng web local dashboard.

## Công nghệ

```text
Next.js
React
TypeScript
Tailwind CSS
Node.js runtime
```

## Việc cần làm

```text
Tạo Next.js project.
Cấu hình TypeScript.
Cấu hình Tailwind CSS.
Tạo layout chính.
Tạo sidebar.
Tạo topbar.
Tạo dashboard page trống.
Tạo accounts page trống.
Tạo history page trống.
Tạo analytics page trống.
Tạo settings page trống.
```

## Cấu trúc ban đầu

```text
app/
├── dashboard/
├── accounts/
├── history/
├── analytics/
├── settings/
└── api/

components/
├── layout/
├── dashboard/
├── accounts/
├── quota/
├── history/
├── analytics/
└── ui/

lib/
├── db/
├── services/
├── quota-reader/
├── recommendation/
├── validators/
└── utils/
```

## Điều kiện hoàn thành

```text
App chạy được bằng npm run dev.
Dashboard mở được trên localhost.
Sidebar/topbar hoạt động.
Navigation giữa các page hoạt động.
Chưa cần có logic quota thật.
```

---

# Phase 2 — SQLite Database & Prisma

## Mục tiêu

Tạo local database để lưu account, quota status, quota history, settings và audit logs.

## Công nghệ

```text
SQLite
Prisma
```

## Việc cần làm

```text
Cài Prisma.
Cấu hình SQLite.
Tạo prisma/schema.prisma.
Tạo model Account.
Tạo model QuotaStatus.
Tạo model QuotaHistory.
Tạo model Setting.
Tạo model AuditLog.
Chạy migration đầu tiên.
Tạo Prisma client helper.
Tạo seed data demo.
```

## Database models

```text
Account
QuotaStatus
QuotaHistory
Setting
AuditLog
```

## Lưu ý bảo mật

Schema không được có field:

```text
password
cookie
oauthToken
refreshToken
accessToken
rawSession
secretToken
```

## Điều kiện hoàn thành

```text
SQLite database hoạt động.
Prisma migration chạy được.
Seed data chạy được.
Không có secret fields trong schema.
```

---

# Phase 3 — Local API Routes

## Mục tiêu

Tạo API routes để dashboard và extension sau này dùng chung.

## API cần có

```text
GET    /api/health

GET    /api/accounts
POST   /api/accounts
GET    /api/accounts/:id
PUT    /api/accounts/:id
DELETE /api/accounts/:id

GET    /api/quota/status
POST   /api/quota/refresh-one
POST   /api/quota/refresh-all
POST   /api/quota/manual-override

GET    /api/history
GET    /api/history/:accountId

GET    /api/recommendation

GET    /api/settings
PUT    /api/settings

GET    /api/config/export
POST   /api/config/import
```

## Việc cần làm

```text
Tạo health API.
Tạo account CRUD API.
Tạo quota status API.
Tạo refresh-one API skeleton.
Tạo refresh-all API skeleton.
Tạo manual-override API.
Tạo history API.
Tạo recommendation API.
Tạo settings API.
Tạo export/import API.
Chuẩn hóa response JSON.
Chuẩn hóa error response.
```

## Điều kiện hoàn thành

```text
API trả JSON đúng format.
API đọc/ghi SQLite được.
Không có proxy endpoint.
Không có /v1/chat/completions.
Không có /v1/models.
Không có /proxy.
Không có /rotate.
```

---

# Phase 4 — Account & Chrome Profile Mapping

## Mục tiêu

Cho phép người dùng thêm account và map từng account với Chrome Profile riêng.

## Chức năng

```text
Add account
Edit account
Delete account
Enable/disable account
Set Chrome profile name
Set Chrome profile path
Set browser type
Mark shared account
Set priority
Set note
```

## Account fields

```text
nickname
emailHint
plan
chromeProfileName
chromeProfilePath
browserType
isShared
sharedWith
priority
isActive
note
```

## Ví dụ mapping

```text
AG-01 → Chrome Profile AG-01
AG-02 → Chrome Profile AG-02
AG-03 → Chrome Profile AG-03
AG-04 → Chrome Profile AG-04
AG-05 → Chrome Profile AG-05
AG-06 → Chrome Profile AG-06
AG-07 → Chrome Profile AG-07
AG-08 → Chrome Profile AG-08
```

## Điều kiện hoàn thành

```text
User có thể tạo 8 account.
Mỗi account có thể map với Chrome Profile.
Data lưu vào SQLite.
Dashboard hiển thị danh sách account.
Không lưu secret.
```

---

# Phase 5 — Quota Reader System

## Mục tiêu

Tạo hệ thống reader để Refresh One và Refresh All có thể gọi chung một interface.

## Reader types

```text
mock-reader
auto-reader
manual-override
```

## Interface chuẩn

```ts
export type QuotaRefreshResult = {
  accountId: string;
  success: boolean;
  quotaPercent?: number;
  status: "green" | "yellow" | "red" | "locked" | "unknown" | "error";
  resetEstimate?: string;
  checkedAt: string;
  source: "auto-reader" | "mock-reader" | "manual-override";
  errorCode?: string;
  errorMessage?: string;
};
```

## Error codes

```text
PROFILE_NOT_FOUND
ACCOUNT_NOT_LOGGED_IN
SESSION_EXPIRED
QUOTA_NOT_DETECTED
TIMEOUT
UNKNOWN_ERROR
```

## Việc cần làm

```text
Implement mock-reader.
Implement real-reader skeleton.
Implement profile-detector skeleton.
Implement error normalizer.
Implement result normalizer.
Implement status threshold logic.
```

## Điều kiện hoàn thành

```text
Mock reader chạy được.
Real reader có interface rõ ràng.
Refresh result được normalize.
Reader lỗi không làm crash app.
Mock reader không được đánh dấu là production.
```

---

# Phase 6 — Refresh One Account

## Mục tiêu

Cho phép refresh quota cho từng account.

## Flow

```text
User bấm Refresh One
→ API nhận accountId
→ Load account từ SQLite
→ Load Chrome Profile mapping
→ Gọi quota-reader
→ Nếu success: update quota_status
→ Luôn ghi quota_history
→ Ghi audit_log
→ Trả result về UI
```

## Rule quan trọng khi lỗi

Nếu refresh lỗi:

```text
Không xóa quota cũ.
Không set quotaPercent = null nếu trước đó có data tốt.
Không ghi đè dữ liệu tốt bằng error rỗng.
Chỉ update errorCode, errorMessage, lastErrorAt.
Vẫn ghi history record cho lần refresh lỗi.
Dashboard hiển thị quota cũ kèm warning.
```

## Điều kiện hoàn thành

```text
Refresh One hoạt động.
Kết quả thành công lưu vào quota_status.
Mọi lần refresh lưu vào quota_history.
Error được hiển thị rõ.
Data tốt không bị mất khi refresh lỗi.
```

---

# Phase 7 — Refresh All Accounts

## Mục tiêu

Cho phép refresh quota của toàn bộ active accounts bằng một nút.

Đây là core feature của dự án.

## Flow

```text
User bấm Refresh All
→ API lấy danh sách account active
→ Check từng account theo thứ tự
→ Account thành công thì update quota_status
→ Account lỗi thì ghi lỗi riêng
→ Một account lỗi không dừng toàn bộ process
→ Trả summary về dashboard
```

## Summary cần trả

```text
total
successCount
errorCount
skippedCount
startedAt
finishedAt
durationMs
results
```

## UI cần có

```text
Refresh All button
Loading state
Progress state
Success state
Error summary
Per-account result
Last refresh time
```

## Điều kiện hoàn thành

```text
Refresh All hoạt động.
Check được nhiều account.
Một account lỗi không làm dừng toàn bộ.
Có summary kết quả.
Có history cho từng account.
Có error riêng cho từng account.
```

---

# Phase 8 — Auto Refresh Scheduler

## Mục tiêu

Cho phép tự động refresh quota theo chu kỳ an toàn.

## Settings

```text
autoRefreshEnabled
autoRefreshIntervalMinutes
refreshOnlyActiveAccounts
skipRecentErrorAccounts optional
```

## Default

```text
Auto refresh: off by default
Interval: 10 minutes
Minimum interval: 5 minutes
```

## Việc cần làm

```text
Tạo setting bật/tắt auto refresh.
Tạo setting interval.
Implement scheduler.
Prevent refresh quá dày.
Hiển thị last auto refresh.
Hiển thị next refresh.
```

## Điều kiện hoàn thành

```text
Auto refresh bật/tắt được.
Interval chỉnh được.
Không refresh quá nhanh.
Auto refresh lỗi không crash app.
Dashboard cập nhật sau auto refresh.
```

---

# Phase 9 — Status Dashboard

## Mục tiêu

Tạo dashboard tổng quan giống local status dashboard.

## Cards cần có

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
```

## Account table columns

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

## Actions

```text
Refresh One
View History
Manual Override
Edit Account
Disable Account
Delete Account
```

## Điều kiện hoàn thành

```text
Dashboard nhìn được toàn bộ quota nhanh.
Account table rõ ràng.
Quota progress bar hoạt động.
Status badge hoạt động.
Error badge hoạt động.
Stale badge hoạt động.
Refresh All button nổi bật.
```

---

# Phase 10 — Recommendation Engine

## Mục tiêu

Gợi ý account tốt nhất nên dùng tiếp.

## Logic mặc định

```text
Quota > 50% + not shared + fresh data → ưu tiên cao nhất
Quota > 50% + shared + fresh data → ưu tiên trung bình
Quota 20–50% → chỉ dùng task nhỏ
Quota < 20% → tránh dùng
Quota = 0% → không dùng
Locked → không dùng
Unknown/Error → không dùng
Stale data → cần refresh trước khi dùng
```

## Output cần có

```text
recommended account
reason
warnings
alternative accounts
last checked age
```

## Điều kiện hoàn thành

```text
Recommendation API hoạt động.
Dashboard hiển thị recommended account.
Không recommend account red/locked/error/unknown.
Ưu tiên account fresh và quota cao.
Có reason rõ ràng.
```

---

# Phase 11 — Quota History & Analytics

## Mục tiêu

Lưu lịch sử quota và phát hiện dấu hiệu bất thường.

## History table

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

## Filters

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

## Analytics

```text
Quota over time
Quota drop by account
Fastest draining account
Most stable account
Shared account with highest drop
Accounts needing login
Accounts with repeated errors
```

## Alerts

```text
Quota drop detected
Fast drain warning
Account became red
Session expired
Data stale
Repeated refresh error
```

## Điều kiện hoàn thành

```text
History page hoạt động.
Filter hoạt động.
Quota drop detection cơ bản hoạt động.
Có cảnh báo account tụt quota nhanh.
Có cảnh báo account cần login lại.
```

---

# Phase 12 — Manual Override / Fallback

## Mục tiêu

Cho phép người dùng nhập/sửa quota thủ công khi auto reader lỗi.

Manual không phải tính năng chính.

## Khi dùng manual

```text
Quota reader lỗi.
Antigravity đổi cơ chế.
Account bị logout.
Người dùng muốn override tạm.
```

## Form

```text
Account
Quota percent
Status
Reset estimate
Note
Checked at
```

## Source

```text
manual-override
```

## Điều kiện hoàn thành

```text
Manual override hoạt động.
Manual override ghi history.
Dashboard phân biệt rõ source auto-reader và manual-override.
UI ghi rõ manual là fallback.
```

---

# Phase 13 — Settings Page

## Mục tiêu

Cho phép người dùng cấu hình app.

## Settings cần có

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

## Điều kiện hoàn thành

```text
Settings lưu vào SQLite.
Dashboard dùng settings mới.
Threshold thay đổi được.
Auto refresh interval thay đổi được.
Có confirm cho thao tác nguy hiểm.
```

---

# Phase 14 — Import / Export Config

## Mục tiêu

Backup và restore dữ liệu local.

## Export gồm

```text
accounts
quota_status
quota_history
settings
audit_logs
exported_at
app_version
```

## Không export

```text
password
cookie
OAuth token
access token
raw browser session
2FA code
recovery code
```

## Import yêu cầu

```text
Validate schema.
Check app version.
Preview before import.
Confirm before overwrite.
Reject secret-like fields.
Write audit log.
```

## Điều kiện hoàn thành

```text
Export JSON được.
Import JSON được.
Import có validation.
Import có preview.
Import có confirm.
Không export/import secret.
```

---

# Phase 15 — Security Hardening

## Mục tiêu

Đảm bảo app an toàn khi chạy lâu dài trên máy cá nhân.

## Local-only

```text
Bind 127.0.0.1 hoặc localhost.
Không mặc định bind 0.0.0.0.
Không expose public internet.
```

## No secrets

```text
Không lưu password.
Không lưu cookie.
Không lưu OAuth refresh token.
Không lưu access token.
Không lưu raw session.
Không lưu Antigravity secret token.
```

## No proxy

Không có endpoint:

```text
/v1/chat/completions
/v1/models
/proxy
/rotate
/account-switch
```

## Audit log

Ghi lại:

```text
Account added
Account edited
Account deleted
Quota refreshed
Quota refresh failed
Refresh all started
Refresh all completed
Manual override created
Settings changed
Export created
Import completed
```

## Điều kiện hoàn thành

```text
SECURITY.md đầy đủ.
Không có secret fields.
Không có proxy endpoint.
API bind local only.
Audit log hoạt động.
Có confirm cho thao tác nguy hiểm.
```

---

# Phase 16 — Optional Antigravity IDE Extension

## Mục tiêu

Tạo extension để xem quota nhanh trong Antigravity IDE.

Extension không thay thế web dashboard.

## Extension features

```text
Status bar quota summary
Sidebar account list
Recommended account
Refresh data command
Open dashboard command
Offline status if local API is down
```

## Extension API calls

```text
GET  /api/health
GET  /api/quota/status
GET  /api/recommendation
POST /api/quota/refresh-all
```

## Status bar example

```text
AG: AG-01 · 82% · Green
```

## Sidebar example

```text
Recommended
└── AG-01 · 82% · Green

Accounts
├── AG-01 · 82% · Green
├── AG-02 · 35% · Yellow
└── AG-03 · Error · Session expired
```

## Điều kiện hoàn thành

```text
Extension build được.
Extension cài được vào Antigravity IDE.
Extension gọi Local API được.
Nếu local API offline thì extension không crash.
Extension không lưu secret.
Extension không tự proxy request.
```

---

# Phase 17 — Packaging & Release

## Mục tiêu

Đóng gói để người dùng dễ chạy.

## Dev command

```bash
npm install
npm run dev
```

## Production command

```bash
npm run build
npm start
```

## Tài liệu cần có

```text
README.md
INSTALL.md
USAGE.md
SECURITY.md
CHANGELOG.md
docs/ARCHITECTURE.md
docs/QUOTA_READER_FEASIBILITY.md
```

## Optional desktop wrapper

```text
Tauri
Electron
```

## Điều kiện hoàn thành

```text
User có thể install và chạy app local.
Docs rõ ràng.
Có hướng dẫn backup/export.
Có hướng dẫn security.
Nếu có extension thì đóng gói .vsix được.
```

---

# Phase 18 — Maintenance

## Mục tiêu

Duy trì app ổn định và dễ mở rộng.

## Việc cần làm

```text
Fix bugs.
Improve UI/UX.
Improve quota reader.
Improve recommendation logic.
Improve analytics.
Backup/restore data.
Write tests.
Update docs.
Monitor Antigravity changes.
```

## Nguyên tắc duy trì

```text
Auto quota reader là core.
Refresh All là core.
Manual fallback không được xóa.
SQLite là source of truth.
No secret storage.
No proxy.
No auto-rotation.
Local-first.
User remains in control.
Extension is optional.
```

---

# MVP Checklist

MVP phải có:

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

MVP chưa cần:

```text
Antigravity extension
Desktop packaging
Cloud sync
Multi-user server
Advanced analytics
Perfect real quota reader if feasibility is not yet proven
```

Quan trọng:

```text
Mock reader alone is not considered full completion.
Refresh All using only mock-reader is not considered production-ready.
Real reader feasibility must be documented.
```

---

# Task Order for AI Agent

```text
1. Read README.md.
2. Read Plan.md.
3. Read Phase.md.
4. Read .agents/* rules.
5. Create Next.js project.
6. Configure TypeScript.
7. Configure Tailwind CSS.
8. Configure Prisma + SQLite.
9. Create Prisma schema.
10. Run migration.
11. Create Prisma client helper.
12. Create shared enums/types.
13. Create /api/health.
14. Create account CRUD APIs.
15. Create quota status API.
16. Create quota-reader interface.
17. Create mock-reader.
18. Create real-reader skeleton.
19. Create refresh-one API.
20. Create refresh-all API.
21. Implement no-overwrite-good-data rule.
22. Create quota history API.
23. Create recommendation logic/API.
24. Create settings API.
25. Create export/import API.
26. Build dashboard layout.
27. Build account/profile mapping UI.
28. Build quota status table.
29. Build Refresh One button.
30. Build Refresh All button.
31. Build loading/success/error states.
32. Build recommendation panel.
33. Build history page.
34. Build settings page.
35. Build manual override fallback.
36. Build import/export UI.
37. Add audit logs.
38. Add SECURITY.md.
39. Add README/INSTALL/USAGE.
40. Add quota reader feasibility report.
41. Only then consider extension.
```

---

# Final Acceptance Criteria

Dự án đạt MVP khi:

```text
User chạy app được trên localhost.
User thêm được 8 account.
User map được từng account với Chrome Profile.
User bấm Refresh One được.
User bấm Refresh All được.
Refresh All không dừng nếu 1 account lỗi.
Mỗi account có quota status riêng.
Mỗi lần refresh có history riêng.
Error hiển thị rõ theo từng account.
Quota tốt cũ không bị mất khi refresh lỗi.
Dashboard gợi ý account nên dùng.
Manual override tồn tại nhưng chỉ là fallback.
Settings lưu được.
Export JSON hoạt động.
Không có password/cookie/token field.
Không có proxy endpoint.
Không có auto-rotate.
Có SECURITY.md.
Có quota reader feasibility report.
```

---

# Final Direction

AG Quota Manager phải đi theo hướng:

```text
Next.js + React
Local API routes
SQLite + Prisma
Dashboard localhost
Quota reader
Refresh one account
Refresh all accounts
Manual fallback
Optional Antigravity extension
```

Dự án giống 9Router chỉ ở phần:

```text
Local dashboard
Local API server
SQLite/local storage
Settings
Status dashboard
Account/provider table
Import/export config
```

Dự án không được giống 9Router ở phần:

```text
Proxy
AI routing
Auto fallback provider
Auto account rotation
Token/cookie storage
Quota bypass
```
