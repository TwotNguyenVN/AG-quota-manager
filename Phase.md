# AG Quota Manager — Tài liệu Phase phát triển dự án

## 1. Tổng quan dự án

**AG Quota Manager** là một ứng dụng **local web dashboard** dùng để quản lý và theo dõi quota của nhiều Google account đang sử dụng với Antigravity IDE.

Dự án lấy phong cách local dashboard giống 9Router ở các phần:

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

Tuy nhiên, dự án **không phải AI router**.

Dự án không làm:

```text
Không proxy AI request
Không tạo OpenAI-compatible endpoint
Không auto-rotate account
Không bypass quota
Không lưu Google password
Không lưu Google cookie
Không lưu OAuth refresh token
Không gửi prompt thay người dùng
```

Mục tiêu chính của dự án là:

```text
Tự kiểm tra quota của nhiều Google account
Hiển thị account nào còn quota
Hiển thị account nào gần hết quota
Hiển thị account nào hết quota
Hiển thị account nào lỗi session hoặc cần login lại
Gợi ý account nên dùng tiếp
Lưu lịch sử quota
Cảnh báo account tụt quota nhanh
Có thể xem nhanh quota trong Antigravity IDE qua extension
```

Điểm quan trọng:

```text
Auto quota reader + Refresh All là chức năng chính.
Manual update chỉ là fallback khi auto reader lỗi.
```

---

# 2. Kiến trúc tổng thể

```text
AG Quota Manager
├── Local Web Dashboard
│   ├── Dashboard Overview
│   ├── Account Management
│   ├── Chrome Profile Mapping
│   ├── Quota Status
│   ├── Quota History
│   ├── Recommendation
│   ├── Analytics
│   ├── Settings
│   └── Import / Export
│
├── Local API Server
│   ├── Accounts API
│   ├── Quota API
│   ├── Refresh API
│   ├── History API
│   ├── Recommendation API
│   ├── Settings API
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
│   ├── Refresh one account
│   ├── Refresh all accounts
│   ├── Detect quota status
│   ├── Detect session/account error
│   └── Save result to SQLite
│
└── Optional Antigravity IDE Extension
    ├── Status Bar
    ├── Quick Quota View
    ├── Recommended Account
    ├── Refresh Data
    └── Open Dashboard Command
```

Luồng hoạt động chính:

```text
User mở dashboard localhost
→ Dashboard gọi Local API
→ Local API gọi Quota Reader
→ Quota Reader kiểm tra quota từng account
→ Kết quả lưu vào SQLite
→ Dashboard hiển thị quota/status/history/recommendation
```

Luồng extension:

```text
User đang code trong Antigravity IDE
→ Extension gọi Local API
→ Extension hiển thị quota nhanh
→ Extension gợi ý account nên dùng
```

---

# 3. Công nghệ đề xuất

## Core stack

```text
Next.js
React
TypeScript
SQLite
Prisma hoặc Drizzle
Local API Routes
Tailwind CSS hoặc CSS Modules
Node.js runtime
```

## App chạy local

```text
http://localhost:3028
```

Hoặc:

```text
http://127.0.0.1:3028
```

App chỉ nên bind local:

```text
127.0.0.1
localhost
```

Không mặc định bind:

```text
0.0.0.0
```

---

# 4. Nguyên tắc bảo mật bắt buộc

Dự án không được lưu:

```text
Google password
Google cookie
OAuth refresh token
Access token dài hạn
2FA code
Recovery code
Raw browser session
Antigravity secret token
```

Dự án không được có:

```text
/v1/chat/completions
/v1/models
/proxy
/rotate
/account-switch
AI request forwarding
Auto account rotation
```

Dự án chỉ được làm:

```text
Đọc quota/status nếu có session hợp lệ
Lưu account metadata
Lưu quota status
Lưu quota history
Gợi ý account nên dùng
Hiển thị dashboard local
Hiển thị quick view trong extension
```

---

# 5. Tổng quan các phase phát triển

```text
Phase 0  → Scope & Architecture Lock
Phase 1  → Next.js Local Dashboard Foundation
Phase 2  → SQLite Database & Local API
Phase 3  → Account & Chrome Profile Mapping
Phase 4  → Quota Reader Research & Prototype
Phase 5  → Refresh One Account
Phase 6  → Refresh All Accounts
Phase 7  → Auto Refresh Scheduler
Phase 8  → Status Dashboard
Phase 9  → Recommendation Engine
Phase 10 → Quota History & Analytics
Phase 11 → Manual Override / Fallback
Phase 12 → Settings Page
Phase 13 → Import / Export Config
Phase 14 → Security Hardening
Phase 15 → Optional Antigravity IDE Extension
Phase 16 → Packaging & Release
Phase 17 → Maintenance
```

Thứ tự ưu tiên:

```text
Dashboard local trước
→ SQLite + Local API
→ Account/Profile mapping
→ Quota Reader
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
→ Extension
```

---

# Phase 0 — Scope & Architecture Lock

## Mục tiêu

Chốt rõ dự án là một **local web dashboard phong cách 9Router**, nhưng chỉ dùng để quản lý quota account.

## Việc cần làm

```text
Chốt tên dự án: AG Quota Manager
Chốt mô tả dự án
Chốt kiến trúc Next.js + SQLite + Local API
Chốt port local mặc định
Chốt SQLite là nguồn dữ liệu chính
Chốt Auto Quota Reader là tính năng chính
Chốt Manual Override chỉ là fallback
Chốt không proxy
Chốt không auto-rotate account
Chốt không lưu secret
```

## Kết quả cần có

```text
README.md
PROJECT_REQUIREMENTS.md
ARCHITECTURE.md
ROADMAP.md
SECURITY.md
```

## Điều kiện hoàn thành

```text
Tài liệu ghi rõ app chạy local.
Tài liệu ghi rõ app không proxy.
Tài liệu ghi rõ app không auto-rotate.
Tài liệu ghi rõ app không lưu secret.
Tài liệu ghi rõ Refresh All là tính năng chính.
Tài liệu ghi rõ manual update chỉ là fallback.
```

---

# Phase 1 — Next.js Local Dashboard Foundation

## Mục tiêu

Tạo nền tảng web local dashboard.

## Tech stack

```text
Next.js
React
TypeScript
Tailwind CSS hoặc CSS Modules
Node.js runtime
```

## Cấu trúc repo đề xuất

```text
ag-quota-manager/
├── app/
│   ├── dashboard/
│   ├── accounts/
│   ├── history/
│   ├── analytics/
│   ├── settings/
│   └── api/
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
│   ├── services/
│   ├── quota-reader/
│   ├── recommendation/
│   ├── validators/
│   └── utils/
│
├── prisma/ hoặc drizzle/
├── docs/
├── README.md
├── package.json
└── .env.example
```

## Script đề xuất

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:migrate
npm run db:studio
```

## Điều kiện hoàn thành

```text
Next.js app chạy được local.
Có sidebar/topbar.
Có dashboard page trống.
Có accounts page trống.
Có history page trống.
Có settings page trống.
Có layout dashboard giống admin tool.
```

---

# Phase 2 — SQLite Database & Local API

## Mục tiêu

Tạo database local và API routes để dashboard dùng.

## Database

Sử dụng SQLite.

## ORM

Có thể chọn:

```text
Prisma nếu muốn phổ biến, dễ cho AI agent code.
Drizzle nếu muốn nhẹ hơn.
```

## Bảng accounts

```text
id
nickname
email_hint
plan
chrome_profile_name
chrome_profile_path
browser_type
is_shared
shared_with
priority
is_active
note
created_at
updated_at
```

## Bảng quota_status

```text
id
account_id
quota_percent
status
reset_estimate
last_checked_at
source
error_message
created_at
updated_at
```

## Bảng quota_history

```text
id
account_id
quota_percent
status
reset_estimate
source
checked_at
error_message
note
created_at
```

## Bảng settings

```text
id
key
value
updated_at
```

## Bảng audit_logs

```text
id
action
entity_type
entity_id
metadata
created_at
```

## API cần có

### Health

```text
GET /api/health
```

### Accounts

```text
GET    /api/accounts
POST   /api/accounts
GET    /api/accounts/:id
PUT    /api/accounts/:id
DELETE /api/accounts/:id
```

### Quota

```text
GET  /api/quota/status
POST /api/quota/refresh-one
POST /api/quota/refresh-all
POST /api/quota/manual-override
```

### History

```text
GET /api/history
GET /api/history/:accountId
```

### Recommendation

```text
GET /api/recommendation
```

### Settings

```text
GET /api/settings
PUT /api/settings
```

### Import / Export

```text
GET  /api/config/export
POST /api/config/import
```

## Điều kiện hoàn thành

```text
SQLite hoạt động.
Migration chạy được.
API health hoạt động.
API accounts CRUD hoạt động.
API quota status hoạt động.
Không có field password/cookie/token.
Không có proxy endpoint.
```

---

# Phase 3 — Account & Chrome Profile Mapping

## Mục tiêu

Cho phép người dùng thêm account và map account với Chrome Profile riêng.

Đây là nền tảng để quota reader biết account nào cần kiểm tra.

## Form account

```text
Nickname
Email hint
Plan
Chrome profile name
Chrome profile path
Browser type
Shared status
Shared with
Priority
Note
Active/Inactive
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

## Account table

```text
Account
Email hint
Plan
Chrome Profile
Shared
Priority
Quota
Status
Last Checked
Error
Actions
```

## Điều kiện hoàn thành

```text
Thêm account được.
Sửa account được.
Xóa account được.
Map Chrome Profile được.
Account lưu vào SQLite.
Dashboard hiển thị danh sách account.
Không lưu secret.
```

---

# Phase 4 — Quota Reader Research & Prototype

## Mục tiêu

Nghiên cứu và tạo module thử nghiệm để đọc quota thật từ Antigravity/local session/account profile.

Đây là phase quan trọng nhất về kỹ thuật.

## Module đề xuất

```text
lib/quota-reader/
├── index.ts
├── types.ts
├── profile-detector.ts
├── antigravity-reader.ts
├── errors.ts
└── mock-reader.ts
```

## Interface đề xuất

```ts
type QuotaRefreshResult = {
  accountId: string;
  success: boolean;
  quotaPercent?: number;
  status?: "green" | "yellow" | "red" | "locked" | "unknown" | "error";
  resetEstimate?: string;
  checkedAt: string;
  source: "auto-reader" | "mock-reader";
  errorMessage?: string;
};
```

## Yêu cầu

Quota reader chỉ được:

```text
Đọc quota nếu có session hợp lệ.
Trả quota percent/status/reset estimate.
Trả lỗi nếu không đọc được.
Không lưu password.
Không lưu cookie.
Không lưu OAuth token.
Không proxy request.
Không auto-rotate account.
```

## Error cần chuẩn hóa

```text
PROFILE_NOT_FOUND
ACCOUNT_NOT_LOGGED_IN
SESSION_EXPIRED
QUOTA_NOT_DETECTED
TIMEOUT
UNKNOWN_ERROR
```

## Điều kiện hoàn thành

```text
Có quota-reader interface.
Có mock-reader để test UI.
Có prototype reader nếu tìm được nguồn quota thật.
Reader trả kết quả chuẩn.
Reader lỗi không làm crash app.
Không lưu secret.
```

---

# Phase 5 — Refresh One Account

## Mục tiêu

Cho phép refresh quota từng account.

## Flow

```text
User bấm Refresh AG-01
→ API nhận accountId
→ Load account + Chrome Profile mapping
→ Gọi quota-reader
→ Nếu thành công: update quota_status
→ Ghi quota_history
→ Ghi audit_log
→ Trả kết quả về dashboard
```

## Nếu lỗi

```text
Không xóa quota cũ.
Không ghi đè dữ liệu tốt bằng null.
Ghi error_message.
Ghi history source = auto-reader với error.
Hiển thị lỗi ở account row.
```

## Điều kiện hoàn thành

```text
Refresh từng account được.
Kết quả lưu vào SQLite.
History được ghi.
Error được hiển thị.
Một account lỗi không crash app.
Manual fallback vẫn có thể dùng sau này.
```

---

# Phase 6 — Refresh All Accounts

## Mục tiêu

Cho phép kiểm tra quota của toàn bộ account chỉ bằng một nút.

Đây là tính năng cốt lõi giúp dự án có giá trị thật.

## Flow

```text
User bấm Refresh All
→ API lấy danh sách account active
→ Check từng account một
→ Account nào thành công thì update quota_status
→ Account nào lỗi thì ghi error riêng
→ Không dừng toàn bộ nếu một account lỗi
→ Trả summary về dashboard
```

## Summary kết quả

```text
Total accounts
Success count
Error count
Skipped count
Started at
Finished at
Duration
```

## Điều kiện hoàn thành

```text
Refresh All hoạt động.
Check được nhiều account theo thứ tự.
Một account lỗi không dừng process.
Có progress/loading state.
Có summary sau refresh.
Có history cho từng account.
Có error riêng cho từng account.
```

---

# Phase 7 — Auto Refresh Scheduler

## Mục tiêu

Tự động refresh quota theo chu kỳ.

## Settings

```text
Enable auto refresh
Refresh interval
Refresh only active accounts
Skip accounts with recent error optional
```

## Interval mặc định

```text
5–10 phút/lần
```

Không nên refresh quá nhanh.

## Flow

```text
Scheduler chạy
→ Gọi Refresh All
→ Cập nhật dashboard
→ Ghi history
→ Ghi error nếu có
```

## Điều kiện hoàn thành

```text
Auto refresh bật/tắt được.
Interval chỉnh được trong settings.
Auto refresh không chạy quá dày.
Auto refresh lỗi không crash app.
Dashboard hiển thị last auto refresh.
```

---

# Phase 8 — Status Dashboard

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

## Account table

```text
Account
Profile
Plan
Quota
Status
Shared
Last Checked
Reset
Error
Actions
```

## Actions

```text
Refresh one
View history
Manual override
Edit account
Disable account
```

## Điều kiện hoàn thành

```text
Dashboard hiển thị status tổng quan.
Account table rõ ràng.
Quota progress bar hoạt động.
Status badge hoạt động.
Error badge hoạt động.
Last refresh hiển thị đúng.
```

---

# Phase 9 — Recommendation Engine

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

## Output

```text
Recommended account
Reason
Warning
Alternative accounts
Last checked age
```

## Điều kiện hoàn thành

```text
Có API /api/recommendation.
Dashboard hiển thị recommended account.
Không chọn account red/locked/error.
Không chọn account stale nếu có account fresh hơn.
Có reason rõ ràng.
```

---

# Phase 10 — Quota History & Analytics

## Mục tiêu

Lưu lịch sử quota và phát hiện usage bất thường.

## History page

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

## Filter

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
```

## Điều kiện hoàn thành

```text
History lưu đầy đủ.
History filter được.
Có analytics cơ bản.
Có cảnh báo quota drop.
Có cảnh báo account cần login lại.
```

---

# Phase 11 — Manual Override / Fallback

## Mục tiêu

Cho phép người dùng nhập/sửa quota thủ công khi auto reader lỗi.

Manual không phải tính năng chính, chỉ là fallback.

## Khi dùng manual

```text
Quota reader lỗi.
Antigravity đổi cơ chế.
Account bị logout.
Người dùng muốn override tạm.
```

## Form manual override

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
Manual override không thay thế auto reader.
Dashboard phân biệt rõ source auto-reader và manual-override.
```

---

# Phase 12 — Settings Page

## Mục tiêu

Cấu hình dashboard và refresh behavior.

## Settings cần có

```text
Green threshold
Red threshold
Stale data threshold
Refresh interval
Auto refresh on/off
Default dashboard port
Theme
Recommendation strategy
Confirm before delete
Confirm before import overwrite
Audit log on/off
```

## Điều kiện hoàn thành

```text
Settings lưu SQLite.
Threshold thay đổi được.
Refresh interval chỉnh được.
Dashboard dùng settings mới.
Có confirm cho thao tác nguy hiểm.
```

---

# Phase 13 — Import / Export Config

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
Validate schema
Check app version
Preview before import
Confirm before overwrite
Reject secret-like fields
Write audit log
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

# Phase 14 — Security Hardening

## Mục tiêu

Đảm bảo app an toàn khi chạy lâu dài.

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

# Phase 15 — Optional Antigravity IDE Extension

## Mục tiêu

Tạo extension để xem quota nhanh trong Antigravity IDE.

Extension không thay thế web dashboard.

Extension dùng Local API để đọc dữ liệu.

## Extension features

```text
Status bar quota summary
Sidebar account list
Recommended account
Refresh data command
Open dashboard command
Show error/offline status
```

## Status bar ví dụ

```text
AG: AG-01 · 82% · Green
```

## Sidebar ví dụ

```text
Recommended
└── AG-01 · 82% · Green

Accounts
├── AG-01 · 82% · Green
├── AG-02 · 35% · Yellow
└── AG-03 · Error · Session expired
```

## Extension API calls

```text
GET /api/health
GET /api/quota/status
GET /api/recommendation
POST /api/quota/refresh-all
```

## Điều kiện hoàn thành

```text
Extension build được.
Extension cài được vào Antigravity IDE.
Status bar hiển thị quota.
Sidebar hiển thị account list.
Extension gọi Local API được.
Nếu server offline thì không crash.
Extension không lưu secret.
```

---

# Phase 16 — Packaging & Release

## Mục tiêu

Đóng gói để người dùng dễ chạy.

## Web local app

Dev:

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Future desktop wrapper

Có thể đóng gói sau bằng:

```text
Tauri
Electron
```

## Extension package nếu có

```text
ag-quota-manager-extension.vsix
```

## Tài liệu cần có

```text
README.md
INSTALL.md
USAGE.md
SECURITY.md
EXTENSION.md
ROADMAP.md
CHANGELOG.md
```

## Điều kiện hoàn thành

```text
Web app chạy được local.
Có hướng dẫn cài đặt.
Có hướng dẫn refresh quota.
Có hướng dẫn backup/export.
Có hướng dẫn security.
Nếu có extension thì đóng gói .vsix được.
```

---

# Phase 17 — Maintenance

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

# 6. MVP đúng nên đạt

MVP có giá trị thật nên gồm:

```text
Next.js local dashboard
SQLite database
Local API routes
Account/Profile mapping
Quota Reader prototype
Refresh One account
Refresh All accounts
Quota status table
Error handling
Recommendation
Quota history
Manual fallback
Settings cơ bản
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
```

---

# 7. Bản hoàn chỉnh nên có

Bản hoàn chỉnh nên gồm:

```text
Local web dashboard phong cách 9Router
SQLite/local storage
Local API server
Settings page
Status dashboard
Provider/account table
Import/export config
Auto quota reader
Refresh all accounts
Auto refresh scheduler
Quota history
Analytics
Recommendation engine
Manual fallback
Security hardening
Optional Antigravity extension
Packaging rõ ràng
```

---

# 8. Thứ tự task cụ thể cho AI Agent Code

```text
1. Tạo Next.js project.
2. Cấu hình TypeScript.
3. Cấu hình SQLite + ORM.
4. Tạo database schema.
5. Tạo API /api/health.
6. Tạo API accounts CRUD.
7. Tạo account/profile mapping UI.
8. Tạo quota-reader interface.
9. Tạo mock-reader để test flow.
10. Tạo API refresh-one.
11. Tạo API refresh-all.
12. Tạo quota status table.
13. Tạo refresh one button.
14. Tạo refresh all button.
15. Tạo loading/success/error UI.
16. Tạo history table.
17. Tạo recommendation engine.
18. Tạo dashboard cards.
19. Tạo auto refresh scheduler.
20. Tạo manual override fallback.
21. Tạo settings page.
22. Tạo import/export config.
23. Tạo audit logs.
24. Thêm security checks.
25. Viết README/INSTALL/SECURITY.
26. Sau đó mới làm extension.
27. Sau cùng cải thiện quota reader thật.
```

---

# 9. Chốt hướng phát triển

Hướng phát triển phù hợp nhất:

```text
Next.js + React
Local API routes
SQLite
Dashboard localhost
Auto quota reader
Refresh all accounts
Manual fallback
Optional Antigravity extension
```

Dự án nên giống 9Router ở phần:

```text
Local dashboard
Local API server
SQLite/local storage
Settings
Status dashboard
Account/provider table
Import/export config
```

Nhưng tuyệt đối không làm phần:

```text
Proxy
AI routing
Auto fallback provider
Auto account rotation
Token/cookie storage
Quota bypass
```

---

# 10. Kết luận

AG Quota Manager nên phát triển theo hướng:

```text
Local Web Dashboard trước
→ SQLite Database
→ Local API routes
→ Account/Profile Mapping
→ Quota Reader
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

Điểm cốt lõi:

```text
Tool phải tự check quota.
Refresh All là tính năng chính.
Manual chỉ là fallback.
Không proxy.
Không auto-rotate.
Không lưu secret.
```
