# AG Quota Manager — Tổng quan dự án

## 1. Ý tưởng chính

**AG Quota Manager** là một ứng dụng chạy local trên máy người dùng, dùng để quản lý và theo dõi quota của nhiều Google account đang sử dụng với Antigravity IDE.

Dự án lấy phong cách giống 9Router ở phần:

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

Dự án không làm:

```text
Không proxy AI request
Không tạo OpenAI-compatible endpoint
Không auto-rotate account
Không bypass quota
Không lưu password/cookie/OAuth token
Không gửi prompt thay người dùng
```

Mục tiêu chính là:

```text
Tự kiểm tra quota của nhiều account
Hiển thị account nào còn quota
Hiển thị account nào gần hết quota
Hiển thị account nào lỗi hoặc cần login lại
Gợi ý account nên dùng tiếp
Lưu lịch sử quota
Cho phép xem nhanh quota trong Antigravity IDE qua extension
```

---

## 2. Vấn đề dự án giải quyết

Người dùng có nhiều Google account có gói AI Pro để dùng với Antigravity.

Một số account có thể được người khác dùng chung trên máy khác, nên quota có thể giảm mà người dùng không biết.

Nếu phải mở từng account để kiểm tra thủ công thì rất mất thời gian.

Vì vậy, dự án cần giúp người dùng:

```text
Không cần mở từng account để xem quota
Có một dashboard tổng hợp tất cả account
Biết account nào còn dùng được
Biết account nào sắp hết
Biết account nào bị tụt quota nhanh
Biết account nào có lỗi session/login
Xem nhanh quota ngay trong Antigravity IDE
```

---

## 3. Kiến trúc tổng thể

```text
AG Quota Manager
├── Local Web Dashboard
│   ├── Dashboard Overview
│   ├── Account Management
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
│   └── Save results to SQLite
│
└── Optional Antigravity IDE Extension
    ├── Status Bar
    ├── Quick Quota View
    ├── Recommended Account
    ├── Quick Update / Refresh
    └── Open Dashboard Command
```

Luồng hoạt động:

```text
User mở dashboard localhost
→ Dashboard gọi Local API
→ Local API đọc/ghi SQLite
→ Quota Reader kiểm tra quota account
→ Dashboard hiển thị quota/status/history/recommendation

User đang dùng Antigravity IDE
→ Extension gọi Local API
→ Extension hiển thị nhanh account nên dùng
```

---

## 4. Công nghệ đề xuất

Stack chính:

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

Dashboard chạy local:

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

Không mặc định expose ra mạng ngoài:

```text
Không bind 0.0.0.0
Không mở public internet
```

---

## 5. Dữ liệu chính cần quản lý

### Account

Mỗi account cần lưu:

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

Ví dụ:

```text
AG-01
acc01@gmail.com
AI Pro
Chrome Profile: AG-01
Shared: No
Priority: High
Note: Main coding account
```

### Quota Status

```text
Account ID
Quota percent
Status
Reset estimate
Last checked at
Source
Error message
```

### Quota History

```text
Account ID
Quota percent
Status
Source
Checked at
Reset estimate
Error message
Note
```

### Settings

```text
Green threshold
Red threshold
Stale data threshold
Refresh interval
Dashboard port
Recommendation strategy
Security options
```

---

## 6. Chức năng lõi

### 6.1 Account & Profile Mapping

Người dùng khai báo 8 account và map với Chrome Profile riêng.

Ví dụ:

```text
AG-01 → Chrome Profile AG-01
AG-02 → Chrome Profile AG-02
AG-03 → Chrome Profile AG-03
...
AG-08 → Chrome Profile AG-08
```

Mục tiêu là để tool biết account nào ứng với profile nào khi refresh quota.

---

### 6.2 Auto Quota Reader

Đây là chức năng quan trọng nhất.

Tool cần có module đọc quota thật từ Antigravity/local session nếu có thể.

Mục tiêu:

```text
Refresh AG-01
→ đọc quota AG-01
→ cập nhật quota_status
→ ghi quota_history
```

Nếu lỗi:

```text
Profile not found
Account not logged in
Session expired
Could not detect quota
Timeout
Unknown error
```

Tool không được lưu cookie/password/token.

---

### 6.3 Refresh One Account

Người dùng có thể bấm refresh từng account.

```text
Refresh AG-01
Refresh AG-02
Refresh AG-03
```

Khi refresh:

```text
App dùng profile mapping
→ gọi quota-reader
→ lấy quota thật nếu được
→ cập nhật SQLite
→ hiển thị kết quả
```

---

### 6.4 Refresh All Accounts

Đây là chức năng chính giúp dự án có giá trị.

```text
Refresh All
→ check AG-01
→ check AG-02
→ check AG-03
→ ...
→ check AG-08
```

Yêu cầu:

```text
Một account lỗi không làm dừng toàn bộ
Account nào đọc được thì cập nhật
Account nào lỗi thì ghi lỗi riêng
Có last checked
Có error message
Có quota history
```

---

### 6.5 Auto Refresh Scheduler

Sau khi Refresh All ổn định, thêm auto refresh.

Mặc định:

```text
5–10 phút/lần
```

Không nên refresh quá nhanh.

Dashboard sẽ tự cập nhật:

```text
AG-01 còn 82%
AG-02 còn 35%
AG-03 còn 0%
AG-04 lỗi session expired
```

Nếu người khác dùng chung account làm quota tụt, dashboard sẽ thấy ở lần refresh tiếp theo.

---

### 6.6 Status Dashboard

Dashboard hiển thị tổng quan:

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

Account table:

```text
Account | Profile | Plan | Quota | Status | Shared | Last Checked | Error | Actions
```

---

### 6.7 Recommendation Engine

Tool tự gợi ý account nên dùng.

Logic:

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

Ví dụ:

```text
Recommended: AG-01
Reason: quota còn 82%, không shared, vừa check 3 phút trước.
```

---

### 6.8 Quota History & Analytics

Tool lưu lịch sử quota.

Ví dụ:

```text
AG-03: 80% → 40%
AG-02: 50% → 12%
AG-04: error session expired
```

Cảnh báo:

```text
AG-03 tụt quota nhanh, có thể người khác đang dùng.
AG-02 gần hết quota.
AG-04 cần login lại.
```

Analytics nên có:

```text
Quota over time
Quota drop by account
Fastest draining account
Most stable account
Shared account with highest drop
Accounts needing login
```

---

### 6.9 Manual Override / Fallback

Manual update không phải chức năng chính.

Manual chỉ dùng khi:

```text
Quota reader lỗi
Account bị logout
Antigravity đổi cơ chế
Người dùng muốn override tạm
```

Nên gọi là:

```text
Manual Override / Fallback Update
```

Không nên gọi là tính năng chính của MVP.

---

### 6.10 Import / Export Config

Dự án cần export/import dữ liệu giống local config.

Export gồm:

```text
accounts
quota_status
quota_history
settings
audit_logs
exported_at
app_version
```

Không export:

```text
password
cookie
OAuth token
access token
raw browser session
2FA code
recovery code
```

---

### 6.11 Antigravity IDE Extension

Extension là phần mở rộng sau khi web dashboard ổn định.

Extension không thay thế dashboard.

Extension dùng để xem nhanh quota trong IDE.

Chức năng:

```text
Status bar quota summary
Sidebar account list
Recommended account
Open dashboard command
Refresh data command
Quick manual override nếu cần
```

Extension gọi Local API:

```text
GET /api/health
GET /api/quota/status
GET /api/recommendation
POST /api/quota/refresh-all
```

Hiển thị trong status bar:

```text
AG: AG-01 · 82% · Green
```

Sidebar:

```text
Recommended
└── AG-01 · 82% · Green

Accounts
├── AG-01 · 82% · Green
├── AG-02 · 35% · Yellow
└── AG-03 · 0% · Red
```

---

## 7. Các phase phát triển đề xuất

### Phase 0 — Scope & Architecture

Chốt dự án là local web dashboard phong cách 9Router, nhưng không proxy.

Kết quả:

```text
README
ARCHITECTURE
ROADMAP
SECURITY
```

---

### Phase 1 — Next.js Local Dashboard Foundation

Tạo app local:

```text
Next.js
React
TypeScript
Dashboard localhost
Basic layout
Sidebar/topbar
```

---

### Phase 2 — SQLite Database & Local API

Tạo SQLite và API:

```text
accounts
quota_status
quota_history
settings
audit_logs
```

API:

```text
/api/accounts
/api/quota/status
/api/quota/refresh-one
/api/quota/refresh-all
/api/recommendation
/api/history
/api/settings
/api/health
```

---

### Phase 3 — Account & Chrome Profile Mapping

Cho phép thêm/sửa/xóa account và map Chrome profile.

Mục tiêu:

```text
AG-01 → Chrome Profile AG-01
AG-02 → Chrome Profile AG-02
...
```

---

### Phase 4 — Quota Reader Prototype

Tạo module đọc quota.

Mục tiêu:

```text
Refresh one account
Return quota percent/status/reset estimate
Return error if failed
No secret storage
```

---

### Phase 5 — Refresh One

Tạo nút refresh từng account.

```text
Refresh AG-01
→ đọc quota
→ cập nhật SQLite
→ ghi history
```

---

### Phase 6 — Refresh All

Tạo chức năng quan trọng nhất.

```text
Refresh All 8 accounts
→ từng account được check riêng
→ lỗi account nào ghi account đó
→ không dừng toàn bộ
```

---

### Phase 7 — Auto Refresh Scheduler

Tự refresh mỗi 5–10 phút.

Có thể bật/tắt trong settings.

---

### Phase 8 — Status Dashboard

Hiển thị tổng quan account/quota giống local status dashboard.

```text
Green/Yellow/Red/Error count
Recommended account
Last refresh
Account table
```

---

### Phase 9 — Recommendation Engine

Gợi ý account nên dùng.

Không chọn account hết quota/lỗi/stale.

---

### Phase 10 — History & Analytics

Lưu lịch sử quota và phát hiện tụt quota nhanh.

---

### Phase 11 — Manual Override / Fallback

Thêm chức năng nhập/sửa quota thủ công khi auto reader lỗi.

---

### Phase 12 — Import / Export Config

Backup/restore dữ liệu local.

---

### Phase 13 — Security Hardening

Đảm bảo:

```text
No password
No cookie
No OAuth token
No proxy
No auto-rotate
Local only
Audit log
```

---

### Phase 14 — Antigravity IDE Extension

Extension đọc dữ liệu từ Local API và hiển thị nhanh trong IDE.

---

### Phase 15 — Packaging & Release

Đóng gói app:

```text
npm install
npm run dev
npm run build
npm start
```

Sau này có thể đóng gói desktop bằng:

```text
Tauri hoặc Electron
```

---

## 8. MVP đúng nên làm

MVP có giá trị thật phải gồm:

```text
Next.js local dashboard
SQLite
Local API
Account/profile mapping
Quota reader prototype
Refresh one account
Refresh all accounts
Quota status table
Recommendation
History
Error handling
Manual fallback
No secret storage
No proxy
No auto-rotate
```

Không nên chỉ làm manual update.

Manual update chỉ là fallback.

---

## 9. Bản hoàn chỉnh nên có

Bản hoàn chỉnh:

```text
Local web dashboard giống phong cách 9Router
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
Antigravity extension
Security hardening
Packaging rõ ràng
```

---

## 10. Kết luận

AG Quota Manager nên phát triển theo hướng:

```text
Next.js + React
Local API routes
SQLite
Dashboard localhost
Auto quota reader
Refresh all accounts
Optional Antigravity extension
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

Đây mới là hướng giúp dự án thật sự hữu ích cho người dùng có nhiều Google account dùng với Antigravity.
