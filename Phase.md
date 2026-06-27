# AG Quota Manager — Tài liệu Phase phát triển dự án

## 1. Tổng quan dự án

**AG Quota Manager** là công cụ local-first dùng để quản lý quota của nhiều Google account đang sử dụng với Antigravity IDE.

Dự án gồm 2 phần chính:

```text
1. Web Dashboard
   → Quản lý đầy đủ account, quota, history, settings, export/import.

2. Antigravity IDE Extension
   → Xem nhanh quota ngay trong IDE, hiển thị account nên dùng, cập nhật quota nhanh.
```

Mục tiêu là giúp người dùng biết account nào còn quota, account nào gần hết, account nào đang được share, account nào nên dùng tiếp, mà không cần dùng router/proxy nguy hiểm.

---

## 2. Kiến trúc tổng thể

```text
AG Quota Manager
├── Web Dashboard
│   ├── Account CRUD
│   ├── Manual quota update
│   ├── Quota history
│   ├── Recommendation
│   ├── Analytics
│   ├── Settings
│   └── Export / Import
│
├── Local API Server
│   ├── Accounts API
│   ├── Quota API
│   ├── History API
│   ├── Recommendation API
│   └── Settings API
│
├── SQLite Database
│   ├── accounts
│   ├── quota_status
│   ├── quota_history
│   ├── settings
│   └── audit_logs
│
└── Antigravity IDE Extension
    ├── Status Bar
    ├── Sidebar View
    ├── Quick Quota View
    ├── Recommended Account
    ├── Quick Manual Update
    └── Open Dashboard Command
```

Luồng dữ liệu chính:

```text
Web Dashboard  → Local API → SQLite
Extension      → Local API → SQLite
```

SQLite là nguồn dữ liệu chính.

Extension chỉ cache dữ liệu tạm để hiển thị khi local API chưa chạy.

---

## 3. Công nghệ đề xuất

### Core app

```text
Frontend: Next.js
Backend/API: Next.js API Routes hoặc Express
Database: SQLite
ORM: Prisma hoặc Drizzle
Language: TypeScript
Runtime: Node.js
```

### Extension

```text
Platform: VS Code-compatible Extension API
Language: TypeScript
UI: Status Bar + Sidebar Tree View + Optional Webview
Storage: Extension globalState chỉ để cache tạm
```

### Optional future helper

```text
Quota Reader: Node.js local helper / Playwright
Binding: 127.0.0.1 only
Purpose: semi-auto refresh quota nếu làm được an toàn
```

---

## 4. Nguyên tắc bắt buộc

Dự án phải tuân thủ các nguyên tắc sau:

```text
Không lưu Google password.
Không lưu Google cookie.
Không lưu OAuth refresh token.
Không lưu access token dài hạn.
Không làm AI proxy.
Không tạo OpenAI-compatible endpoint.
Không auto-rotate account.
Không bypass quota.
Không gửi prompt thay người dùng.
Không expose app ra public internet.
Manual quota update luôn phải tồn tại.
```

Dự án này là:

```text
Quota dashboard + IDE quick viewer
```

Không phải:

```text
AI router
Proxy
Account switcher
Quota bypass tool
```

---

# 5. Tổng quan lộ trình phát triển

```text
Phase 0  → Chốt scope & kiến trúc
Phase 1  → Project foundation
Phase 2  → Database & Local API
Phase 3  → Web Dashboard MVP
Phase 4  → Quota History + Recommendation
Phase 5  → Settings + Export/Import
Phase 6  → Antigravity Extension Foundation
Phase 7  → Extension Quick View + Status Bar
Phase 8  → Extension Quick Update + Sync
Phase 9  → Analytics + Smart Alerts
Phase 10 → Security Hardening
Phase 11 → Packaging & Release
Phase 12 → Optional Semi-Auto Quota Reader
Phase 13 → Maintenance & Improvement
```

Thứ tự phát triển khuyến nghị:

```text
Web Dashboard trước
→ Local API ổn định
→ Extension đọc dữ liệu từ API
→ Quick update trong extension
→ Analytics
→ Security
→ Packaging
→ Semi-auto refresh sau cùng
```

---

# Phase 0 — Scope & Architecture Lock

## Mục tiêu

Chốt rõ hướng phát triển mới của dự án:

```text
Web Dashboard để quản lý đầy đủ.
Extension để xem nhanh trong Antigravity IDE.
SQLite là dữ liệu chính.
Local API là cầu nối giữa Web và Extension.
```

## Việc cần làm

- Chốt tên dự án: **AG Quota Manager**.
- Chốt mô tả dự án.
- Chốt kiến trúc Web + Extension + SQLite + Local API.
- Chốt những gì được làm.
- Chốt những gì không được làm.
- Chốt MVP đầu tiên.
- Chốt thứ tự phát triển.
- Chốt nguyên tắc bảo mật.

## Kết quả cần có

```text
README.md
PROJECT_REQUIREMENTS.md
ROADMAP.md
SECURITY.md
ARCHITECTURE.md
```

## Điều kiện hoàn thành

Phase này hoàn thành khi tài liệu ghi rõ:

```text
App có web dashboard.
App có extension trong Antigravity IDE.
Extension không lưu dữ liệu chính.
SQLite là nguồn dữ liệu chính.
Không proxy.
Không auto-rotate account.
Không lưu secret.
```

---

# Phase 1 — Project Foundation

## Mục tiêu

Tạo nền tảng code cho cả web app và extension.

## Cấu trúc repo đề xuất

```text
ag-quota-manager/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   │
│   └── extension/
│       ├── src/
│       ├── media/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/
│   │   ├── types/
│   │   ├── constants/
│   │   └── validation/
│   │
│   └── database/
│       ├── schema/
│       ├── migrations/
│       └── client/
│
├── docs/
├── README.md
└── package.json
```

## Việc cần làm

- Tạo monorepo hoặc repo có cấu trúc rõ ràng.
- Tạo app web bằng Next.js.
- Tạo extension project bằng TypeScript.
- Tạo package shared types.
- Cấu hình ESLint/Prettier.
- Cấu hình TypeScript.
- Cấu hình script chạy local.

## Script đề xuất

```bash
npm run dev:web
npm run dev:extension
npm run build:web
npm run build:extension
npm run lint
```

## Điều kiện hoàn thành

```text
Web app chạy được local.
Extension project build được.
Có shared types.
Có cấu trúc thư mục rõ ràng.
Chưa cần database thật.
Chưa cần UI hoàn chỉnh.
```

---

# Phase 2 — Database & Local API

## Mục tiêu

Tạo dữ liệu trung tâm để web và extension dùng chung.

## Database

Sử dụng SQLite.

## Tables cần có

### accounts

```text
id
nickname
email_hint
plan
chrome_profile_name
chrome_profile_path
is_shared
shared_with
priority
is_active
note
created_at
updated_at
```

### quota_status

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

### quota_history

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

### settings

```text
id
key
value
updated_at
```

### audit_logs

```text
id
action
entity_type
entity_id
metadata
created_at
```

## Local API endpoints

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
POST /api/quota/manual-update
POST /api/quota/mock-refresh
POST /api/quota/mock-refresh-all
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

### Health

```text
GET /api/health
```

## Điều kiện hoàn thành

```text
SQLite hoạt động.
API CRUD account hoạt động.
API manual update quota hoạt động.
API history hoạt động.
API recommendation trả được dữ liệu.
API health trả trạng thái app.
```

---

# Phase 3 — Web Dashboard MVP

## Mục tiêu

Làm web dashboard quản lý account và quota thủ công.

Đây là phần quản lý chính của hệ thống.

## Trang cần có

```text
Dashboard
Accounts
History
Settings
```

## Dashboard cần hiển thị

```text
Total accounts
Recommended account
Low quota count
Shared account count
Account quota table
Status badges
Last checked time
Reset estimate
```

## Account CRUD

Người dùng cần thêm/sửa/xóa account với các trường:

```text
Nickname
Email hint
Plan
Chrome profile name
Chrome profile path
Shared status
Shared with
Priority
Note
Active/Inactive
```

## Manual quota update

Cho phép nhập:

```text
Quota percent
Reset estimate
Note
Checked time
```

Khi cập nhật quota:

```text
Update quota_status
Insert quota_history
Update last_checked_at
Recalculate status
Recalculate recommendation
Write audit log
```

## Status

```text
Green   → quota > 50%
Yellow  → quota từ 20% đến 50%
Red     → quota < 20%
Locked  → người dùng đánh dấu hoặc detect sau này
Unknown → chưa có dữ liệu
```

## Điều kiện hoàn thành

```text
Web thêm/sửa/xóa account được.
Web nhập quota thủ công được.
Dashboard hiển thị quota chính xác.
Status badge hoạt động.
Dữ liệu lưu SQLite.
Reload web không mất dữ liệu.
Không dùng LocalStorage làm dữ liệu chính.
Không lưu secret.
```

---

# Phase 4 — Quota History + Recommendation

## Mục tiêu

Lưu lịch sử quota và gợi ý account nên dùng.

## Quota History

Mỗi lần update quota phải ghi history.

History cần có:

```text
Account
Quota percent
Status
Source
Checked at
Reset estimate
Note
Error message
```

## History page

Cần filter:

```text
All accounts
By account
Today
Last 7 days
Last 30 days
Manual updates
Mock refresh
Error only
```

## Recommendation logic

Logic mặc định:

```text
Quota > 50% + not shared + fresh data → ưu tiên cao nhất
Quota > 50% + shared + fresh data → ưu tiên trung bình
Quota 20–50% → chỉ dùng task nhỏ
Quota < 20% → tránh dùng
Quota = 0% → không dùng
Locked → không dùng
Unknown → cần update quota
Data stale → cần refresh trước khi dùng
```

## Stale data warning

Mặc định:

```text
Fresh      → dưới 10 phút
Maybe old  → 10–30 phút
Stale      → trên 30 phút
Very stale → trên 2 giờ
```

## Điều kiện hoàn thành

```text
Mỗi lần update quota có history.
History page xem/filter được.
Dashboard có recommended account.
Recommendation không chọn red/locked/unknown.
Có stale warning.
```

---

# Phase 5 — Settings + Export/Import

## Mục tiêu

Cho phép cấu hình và backup dữ liệu.

## Settings cần có

```text
Green threshold
Red threshold
Stale data threshold
Default refresh interval
Default recommendation strategy
Dashboard security options
```

## Export JSON

Export gồm:

```text
accounts
quota_status
quota_history
settings
exported_at
app_version
```

Không được export:

```text
password
cookie
OAuth token
access token
raw session
```

## Import JSON

Import cần:

```text
Validate format
Check version
Preview before import
Confirm before overwrite
Reject secret-like fields
```

## Điều kiện hoàn thành

```text
Settings lưu được.
Threshold đổi được.
Export JSON được.
Import JSON được.
Không export secret.
Có confirm khi ghi đè dữ liệu.
```

---

# Phase 6 — Antigravity Extension Foundation

## Mục tiêu

Tạo extension cơ bản để chạy trong Antigravity IDE.

## Extension commands

```text
AG Quota: Open Dashboard
AG Quota: Refresh Data
AG Quota: Show Recommended Account
AG Quota: Update Quota
AG Quota: Open Settings
```

## Extension structure

```text
apps/extension/
├── src/
│   ├── extension.ts
│   ├── apiClient.ts
│   ├── statusBar.ts
│   ├── treeView.ts
│   ├── commands.ts
│   ├── cache.ts
│   └── types.ts
├── media/
├── package.json
└── README.md
```

## Local API connection

Extension cần gọi:

```text
GET /api/health
GET /api/recommendation
GET /api/quota/status
```

Nếu API không chạy:

```text
Show: AG Quota Manager offline
Use cached data if available
Show command: Open Dashboard
```

## Điều kiện hoàn thành

```text
Extension build được.
Extension activate được.
Extension gọi /api/health được.
Nếu server offline thì không crash.
Có command Open Dashboard.
Có cache tạm.
```

---

# Phase 7 — Extension Quick View + Status Bar

## Mục tiêu

Cho phép người dùng xem quota nhanh trong Antigravity IDE.

## Status Bar

Hiển thị một trong các kiểu:

```text
AG: AG-01 · 82% · Green
```

Hoặc:

```text
AG Quota: 3 Green / 2 Yellow / 1 Red
```

Khi click status bar:

```text
Open quick pick
or
Open dashboard
```

## Sidebar View

Sidebar hiển thị:

```text
Recommended
└── AG-01 · 82% · Green

Accounts
├── AG-01 · 82% · Green
├── AG-02 · 35% · Yellow
└── AG-03 · 0% · Red

Actions
├── Open Dashboard
├── Refresh Data
└── Update Quota
```

## Refresh data

Extension refresh data bằng cách gọi local API.

```text
GET /api/recommendation
GET /api/quota/status
```

## Điều kiện hoàn thành

```text
Status bar hiển thị quota summary.
Sidebar hiển thị danh sách account.
Recommended account hiển thị đúng.
Refresh data command hoạt động.
Server offline không làm extension crash.
```

---

# Phase 8 — Extension Quick Update + Sync

## Mục tiêu

Cho phép cập nhật quota nhanh ngay trong Antigravity IDE.

## Quick update flow

```text
User chọn command: AG Quota: Update Quota
→ Extension hiện danh sách account
→ User chọn account
→ User nhập quota percent
→ User nhập reset estimate hoặc note nếu cần
→ Extension gọi POST /api/quota/manual-update
→ SQLite cập nhật
→ Web dashboard cũng thấy dữ liệu mới
→ Status bar/sidebar refresh lại
```

## API sử dụng

```text
POST /api/quota/manual-update
```

Payload:

```json
{
  "accountId": "AG-01",
  "quotaPercent": 82,
  "resetEstimate": "3h",
  "note": "Updated from IDE extension"
}
```

## Điều kiện hoàn thành

```text
Update quota từ extension được.
Web dashboard thấy dữ liệu mới.
History ghi source = extension-manual.
Status bar update sau khi nhập quota.
Sidebar update sau khi nhập quota.
Không lưu secret trong extension.
```

---

# Phase 9 — Analytics + Smart Alerts

## Mục tiêu

Giúp người dùng hiểu account nào đang bị dùng nhiều, account nào tụt quota nhanh.

## Analytics cần có

```text
Quota over time
Quota drop by account
Most used account
Most stable account
Shared account with highest drop
Best account now
Low quota accounts
Stale accounts
```

## Smart alerts

### Quota drop detection

Ví dụ:

```text
AG-03 giảm từ 80% xuống 40%.
```

Cảnh báo:

```text
Unexpected quota drop detected.
This account may have been used by someone else.
```

### Fast drain warning

```text
AG-02 appears to be draining quickly.
Consider avoiding this account for heavy tasks.
```

### Extension alerts

Extension có thể hiển thị:

```text
AG-02 is now Red.
Recommended account changed to AG-01.
Quota data is stale.
```

## Điều kiện hoàn thành

```text
Có analytics trong web.
Có quota drop detection.
Có fast drain warning.
Extension hiển thị cảnh báo quan trọng.
Không spam notification.
```

---

# Phase 10 — Security Hardening

## Mục tiêu

Đảm bảo hệ thống an toàn khi dùng lâu dài.

## Web/API security

```text
Bind local only: 127.0.0.1
Không bind mặc định vào 0.0.0.0
Không expose internet
Không có proxy endpoint
Không có AI request forwarding
```

## Extension security

```text
Extension chỉ gọi 127.0.0.1
Không gửi dữ liệu ra server ngoài
Không lưu token/cookie/password
Cache chỉ chứa quota summary
```

## No proxy endpoints

Không được có:

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
Quota updated
Quota updated from extension
Settings changed
Export created
Import completed
Refresh failed
```

## Điều kiện hoàn thành

```text
Không lưu secret.
Không có proxy.
Không auto-rotate.
API chỉ local.
Extension không gọi domain ngoài.
Có audit log.
Có SECURITY.md.
```

---

# Phase 11 — Packaging & Release

## Mục tiêu

Đóng gói dự án để dùng dễ dàng.

## Web app packaging

Option 1:

```text
npm install
npm run dev
```

Option 2:

```text
npm run build
npm start
```

Option 3 tương lai:

```text
Desktop wrapper bằng Tauri/Electron
```

## Extension packaging

Tạo file:

```text
ag-quota-manager-extension.vsix
```

Người dùng có thể cài vào Antigravity IDE.

## Release package đề xuất

```text
AG Quota Manager Web App
AG Quota Manager Extension
Documentation
Example config
Security notes
```

## Tài liệu cần có

```text
README.md
INSTALL.md
USAGE.md
EXTENSION.md
SECURITY.md
ROADMAP.md
CHANGELOG.md
```

## Điều kiện hoàn thành

```text
Người dùng chạy được web app local.
Người dùng cài được extension.
Extension kết nối được web app.
Có hướng dẫn setup rõ ràng.
Có hướng dẫn backup/export.
Có cảnh báo security rõ ràng.
```

---

# Phase 12 — Optional Semi-Auto Quota Reader

## Mục tiêu

Nghiên cứu và thêm khả năng refresh quota bán tự động.

Đây là phase tùy chọn, không làm trước MVP.

## Lý do để phase này sau cùng

Auto refresh quota thật có thể cần:

```text
Đọc trạng thái Antigravity
Đọc Chrome Profile
Gọi local/internal endpoint
Dùng Playwright hoặc helper
```

Các việc này dễ hỏng nếu Antigravity/Google thay đổi.

## Quota reader yêu cầu

Quota reader chỉ được:

```text
Đọc quota nếu có session hợp lệ.
Trả quota percent/status/reset estimate.
Ghi lỗi nếu không đọc được.
Không lưu password.
Không lưu cookie.
Không lưu OAuth token.
Không proxy request.
Không auto-rotate account.
```

## API đề xuất

```text
POST /api/quota/refresh-one
POST /api/quota/refresh-all
```

## Refresh one flow

```text
User bấm Refresh AG-01
→ App dùng profile mapping của AG-01
→ Quota reader thử đọc quota
→ Nếu thành công: update quota_status + quota_history
→ Nếu lỗi: giữ data cũ + ghi error
```

## Refresh all flow

```text
Lấy danh sách account active
Check từng account một
Account nào lỗi thì ghi error
Không dừng toàn bộ process
Cập nhật account thành công
Ghi history đầy đủ
```

## Điều kiện hoàn thành

```text
Refresh one account hoạt động.
Refresh all hoạt động.
Một account lỗi không làm hỏng account khác.
Manual update vẫn hoạt động.
Không lưu secret.
Không proxy.
Không auto-rotate.
```

---

# Phase 13 — Maintenance & Improvement

## Mục tiêu

Duy trì dự án ổn định, dễ mở rộng.

## Việc cần làm

```text
Theo dõi lỗi extension.
Theo dõi lỗi local API.
Cập nhật quota reader nếu có.
Backup/restore dữ liệu.
Cải thiện UI/UX.
Cải thiện recommendation logic.
Cải thiện analytics.
Viết test cho API quan trọng.
Viết test cho recommendation logic.
```

## Nguyên tắc duy trì

```text
Manual mode must never be removed.
No secret storage.
No proxy.
No auto-rotation.
Local-first.
User remains in control.
Extension is quick-view only.
SQLite is the source of truth.
```

---

# 6. MVP nhỏ nhất nên đạt

MVP nhỏ nhất nên gồm:

```text
Web Dashboard
- Account CRUD
- Manual quota update
- Status badge
- Quota history
- Recommendation
- Settings threshold
- Export JSON
- SQLite storage

Local API
- /api/accounts
- /api/quota/status
- /api/quota/manual-update
- /api/recommendation
- /api/health

Extension
- Status bar
- Sidebar account list
- Recommended account
- Refresh data from local API
- Open dashboard command

Security
- No password
- No cookie
- No OAuth token
- No proxy
- No auto-rotate
```

MVP chưa cần:

```text
Auto refresh quota thật
Playwright
Chrome Profile automation
Desktop packaging
Cloud sync
Multi-user server
```

---

# 7. Bản hoàn chỉnh nên có

Bản hoàn chỉnh nên đạt:

```text
Web Dashboard đầy đủ
SQLite database
Local API ổn định
Antigravity IDE Extension
Status bar quota summary
Sidebar quota list
Quick quota update trong IDE
Quota history
Analytics
Smart alerts
Export/import
Audit log
Security hardening
Packaging hướng dẫn rõ ràng
Optional semi-auto refresh
```

---

# 8. Thứ tự task cụ thể cho AI Agent Code

Nên giao việc theo thứ tự:

```text
1. Tạo repo structure.
2. Tạo Next.js web app.
3. Tạo SQLite schema.
4. Tạo Accounts API.
5. Tạo Quota manual update API.
6. Tạo History API.
7. Tạo Recommendation API.
8. Tạo dashboard UI.
9. Tạo account CRUD UI.
10. Tạo manual quota update UI.
11. Tạo quota history UI.
12. Tạo settings UI.
13. Tạo export/import JSON.
14. Tạo extension project.
15. Tạo extension API client.
16. Tạo extension status bar.
17. Tạo extension sidebar.
18. Tạo command Open Dashboard.
19. Tạo command Refresh Data.
20. Tạo command Quick Update Quota.
21. Đồng bộ extension với local API.
22. Thêm cache tạm cho extension.
23. Thêm analytics.
24. Thêm audit log.
25. Thêm security checks.
26. Viết README/INSTALL/EXTENSION/SECURITY.
27. Đóng gói extension .vsix.
28. Nghiên cứu semi-auto refresh sau cùng.
```

---

# 9. Chốt hướng phát triển

Hướng phát triển cuối cùng của dự án là:

```text
Next.js Web Dashboard
+
SQLite
+
Local API
+
Antigravity IDE Extension
```

Web dùng để quản lý đầy đủ.

Extension dùng để xem nhanh và cập nhật quota nhanh trong IDE.

SQLite là nguồn dữ liệu chính.

Extension chỉ cache tạm.

Không lưu secret.

Không proxy.

Không auto-rotate account.

Không làm router.

---

# 10. Kết luận

Dự án nên phát triển theo hướng:

```text
Web Dashboard trước
→ Local API ổn định
→ Extension quick view
→ Extension quick update
→ Analytics
→ Security hardening
→ Packaging
→ Optional semi-auto refresh
```

Đây là hướng hợp lý nhất nếu muốn vừa có giao diện quản lý đầy đủ trên web, vừa có extension tiện lợi trong Antigravity IDE để xem nhanh quota khi đang code.
