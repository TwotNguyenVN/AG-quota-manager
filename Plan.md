# Project Requirements: Local Antigravity Quota Dashboard

## 1. Project Name

**Local Antigravity Quota Dashboard**

Tên ngắn: **AG Quota Manager**

## 2. Project Purpose

Dự án này dùng để xây dựng một công cụ local giúp quản lý và theo dõi quota của nhiều Google account đang dùng với Google Antigravity.

Người dùng hiện có nhiều Google account có gói AI Pro. Một số account chỉ người dùng sử dụng, một số account có thể được người khác dùng chung trên máy khác. Vì vậy quota của từng account có thể thay đổi mà người dùng không biết ngay.

Công cụ này cần giúp người dùng biết:

* Account nào còn nhiều quota.
* Account nào gần hết quota.
* Account nào đã hết quota.
* Account nào đang được share với người khác.
* Account nào nên dùng tiếp.
* Account nào nên tránh dùng.
* Lần cuối quota được kiểm tra là khi nào.

Công cụ này chỉ là **quota dashboard**, không phải AI router, không phải proxy, không phải tool tự động xoay account.

## 3. Main Goal

Xây dựng một dashboard chạy local trên máy người dùng để quản lý khoảng 8 Google account AI Pro dùng với Antigravity.

Dashboard cần hỗ trợ:

* Quản lý danh sách account.
* Theo dõi quota/status của từng account.
* Ghi chú account nào đang share với ai.
* Lưu lịch sử quota.
* Cho phép refresh quota thủ công hoặc bán tự động.
* Gợi ý account nào nên dùng.
* Không lưu password, cookie, OAuth refresh token hoặc secret nhạy cảm.

## 4. Non-Goals

Dự án này không được làm các chức năng sau:

* Không tạo OpenAI-compatible API proxy.
* Không route request AI qua nhiều account.
* Không tự động xoay account khi hết quota.
* Không bypass quota.
* Không lưu Google password.
* Không lưu Google cookie trong database.
* Không lưu OAuth refresh token.
* Không lưu access token dài hạn.
* Không tự động đăng nhập Google.
* Không expose dashboard ra public internet.
* Không dùng account người khác nếu chưa có session hợp lệ trên máy người dùng.
* Không can thiệp vào request của Antigravity.
* Không chỉnh sửa file/session nhạy cảm của Antigravity.
* Không làm tool giống AI router.

## 5. Current User Setup

Người dùng đang có cả hai loại Chrome profile.

### 5.1 Main Chrome Profile

Một Chrome profile chính có login nhiều Google account cùng lúc.

Ví dụ:

```text
Main Chrome Profile
├── acc01@gmail.com
├── acc02@gmail.com
├── acc03@gmail.com
├── acc04@gmail.com
├── acc05@gmail.com
├── acc06@gmail.com
├── acc07@gmail.com
└── acc08@gmail.com
```

Profile này chỉ nên dùng cho thao tác bình thường của người dùng. Không nên dùng profile này làm nguồn chính để auto-check quota, vì có thể bị nhầm account do cơ chế nhiều account trong cùng một Chrome profile.

### 5.2 Separate Chrome Profiles

Mỗi Google account cũng có một Chrome profile riêng.

Ví dụ:

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

Đây là nguồn chính mà dashboard nên dùng để check quota.

Mỗi profile riêng nên chỉ login một Google account chính để tránh đọc nhầm quota.

## 6. Required Operating Model

Dashboard phải hoạt động theo hướng:

```text
Local Dashboard
+
Separate Chrome Profile per account
+
Manual/Semi-auto quota refresh
+
Quota history
+
Recommendation logic
+
No password/cookie/token storage
+
No proxy
+
No auto account rotation
```

Người dùng không cần mở sẵn 8 tab cho 8 account.

Điều kiện cần là:

* Máy người dùng đã login sẵn 8 account trong 8 Chrome profile riêng.
* Các session đó vẫn còn hiệu lực.
* Dashboard biết profile nào tương ứng với account nào.
* Khi cần refresh, dashboard có thể kiểm tra lần lượt từng profile.

## 7. Core Features

### 7.1 Account Management

Dashboard phải cho phép người dùng thêm, sửa, xóa account.

Mỗi account cần có các trường:

```text
Account ID
Nickname
Email hint
Chrome profile name/path
Plan
Shared status
Shared with
Priority
Note
Active/Inactive
Created at
Updated at
```

Ví dụ:

```text
Nickname: AG-01
Email hint: acc01@gmail.com
Plan: AI Pro
Chrome Profile: AG-01
Shared: No
Priority: High
Note: Main account for coding
```

### 7.2 Quota Status Management

Mỗi account cần có trạng thái quota hiện tại.

Các trường cần có:

```text
Current quota percent
Status
Last checked at
Reset estimate
Last refresh result
Error message
Manual override flag
```

Status đề xuất:

```text
Green   → còn nhiều quota
Yellow  → quota trung bình
Red     → gần hết hoặc đã hết
Locked  → đang bị giới hạn lâu hơn hoặc chưa thể dùng
Unknown → chưa check được hoặc chưa có dữ liệu
```

Ngưỡng mặc định:

```text
Green  → quota > 50%
Yellow → quota từ 20% đến 50%
Red    → quota < 20%
Empty  → quota = 0%
```

Người dùng nên có thể chỉnh ngưỡng này trong settings.

### 7.3 Manual Update

Dashboard phải có chế độ nhập quota thủ công.

Người dùng có thể tự xem quota trong Antigravity rồi nhập vào dashboard.

Manual update cần cho phép nhập:

```text
Quota percent
Status
Reset estimate
Note
Checked time
```

Manual mode là bắt buộc, vì đây là fallback an toàn nhất nếu auto refresh bị lỗi.

### 7.4 Semi-Auto Refresh

Dashboard nên có chế độ refresh bán tự động.

Các chức năng:

```text
Refresh one account
Refresh all accounts
Auto refresh every N minutes
Stop auto refresh
Show last refresh time
Show refresh error
```

Khi bấm **Refresh All**, dashboard sẽ kiểm tra lần lượt từng account dựa trên Chrome profile riêng.

Không cần mở sẵn 8 tab. Tool có thể mở/check từng profile khi cần.

Refresh không được lưu password/cookie/token vào database của app.

### 7.5 Handling Shared Accounts

Một số account có thể được người khác sử dụng trên máy khác.

Dashboard cần hỗ trợ ghi chú:

```text
Shared: Yes/No
Shared with: name/note
Shared risk level
Last unexpected drop
```

Nếu account được người khác dùng và quota giảm, dashboard có thể phát hiện ở lần refresh tiếp theo, miễn là máy người dùng vẫn có session đăng nhập hợp lệ của account đó.

Ví dụ:

```text
10:00 → AG-03 còn 80%
10:15 → người khác dùng AG-03 trên máy khác
10:20 → dashboard refresh AG-03
10:20 → AG-03 còn 40%
```

Dashboard nên ghi nhận quota drop trong history.

### 7.6 Quota History

Dashboard phải lưu lịch sử quota theo thời gian.

Mỗi lần update quota, dù manual hay auto, cần ghi một bản ghi history.

History record gồm:

```text
Account ID
Quota percent
Status
Source: manual/auto
Checked at
Reset estimate
Error message
Note
```

Dashboard cần có trang xem history của từng account.

Nên có các filter:

```text
Today
Last 7 days
Last 30 days
By account
By status
Shared accounts only
```

### 7.7 Recommendation Logic

Dashboard cần gợi ý account nào nên dùng tiếp.

Logic mặc định:

```text
Nếu quota > 50% và không shared → ưu tiên cao
Nếu quota > 50% và shared → ưu tiên trung bình
Nếu quota từ 20% đến 50% → chỉ nên dùng task nhỏ
Nếu quota < 20% → tránh dùng
Nếu quota = 0% → không dùng
Nếu status Locked → không dùng
Nếu last checked quá cũ → cảnh báo cần refresh trước khi dùng
```

Dashboard nên hiển thị:

```text
Recommended account
Reason
Warning if data is stale
```

Ví dụ:

```text
Recommended: AG-01
Reason: quota còn 82%, không shared, last checked 4 phút trước.
```

### 7.8 Stale Data Warning

Nếu account chưa được check trong một khoảng thời gian nhất định, dashboard phải cảnh báo dữ liệu có thể cũ.

Mặc định:

```text
Fresh      → checked trong 0–10 phút
Maybe old  → checked trong 10–30 phút
Stale      → checked quá 30 phút
Very stale → checked quá 2 giờ
```

Dashboard nên hiển thị cảnh báo:

```text
Quota data may be outdated. Please refresh before using this account.
```

### 7.9 Export Data

Dashboard nên hỗ trợ export dữ liệu.

Format cần có:

```text
CSV
JSON
```

Dữ liệu export:

```text
Account list
Current quota status
Quota history
Notes
```

Export không được chứa secret.

## 8. User Interface Requirements

### 8.1 Main Dashboard Page

Trang chính cần hiển thị bảng account.

Cột đề xuất:

```text
Account
Email hint
Plan
Quota
Status
Shared
Recommended
Last checked
Reset estimate
Actions
```

Actions:

```text
Refresh
Edit
History
Open Profile
Mark as Avoid
```

### 8.2 Account Detail Page

Mỗi account cần có trang chi tiết.

Thông tin cần hiển thị:

```text
Nickname
Email hint
Plan
Chrome profile
Shared info
Current quota
Status
Last checked
Reset estimate
History chart/table
Notes
```

### 8.3 Settings Page

Settings cần có:

```text
Default auto refresh interval
Quota status thresholds
Stale data thresholds
Local dashboard lock option
Export/backup option
Profile mapping settings
```

### 8.4 Visual Status

Dashboard nên dùng màu hoặc badge rõ ràng:

```text
Green badge  → Safe to use
Yellow badge → Use carefully
Red badge    → Avoid
Gray badge   → Unknown
Lock badge   → Locked
```

## 9. Security Requirements

Đây là phần bắt buộc.

### 9.1 Must Not Store Secrets

App không được lưu:

```text
Google password
Google cookie
OAuth refresh token
Access token
2FA code
Recovery code
Raw browser session
Antigravity secret token dài hạn
```

### 9.2 Local Only

Dashboard phải chạy local.

Mặc định chỉ bind:

```text
127.0.0.1
localhost
```

Không bind mặc định vào:

```text
0.0.0.0
```

Không expose public internet.

### 9.3 No Proxy

App không được tạo endpoint để Antigravity gửi request AI qua dashboard.

Không có chức năng:

```text
/v1/chat/completions
/v1/models
proxy endpoint
account rotation endpoint
```

### 9.4 Read-Only Behavior

App chỉ nên đọc quota/status hoặc nhận input từ người dùng.

App không được:

```text
Gửi prompt thay người dùng
Chạy request AI thay người dùng
Chỉnh sửa account Google
Tự logout/login account
Tự đổi account trong Antigravity
```

### 9.5 Manual Fallback

Nếu auto refresh lỗi, app phải cho phép nhập tay.

Không được ép người dùng cung cấp cookie/token để sửa lỗi.

## 10. Refresh Behavior Requirements

### 10.1 Refresh All

Khi người dùng bấm **Refresh All**, app cần:

```text
1. Lấy danh sách account active
2. Sắp xếp theo priority hoặc thứ tự người dùng đặt
3. Check từng account một
4. Cập nhật quota/status nếu thành công
5. Ghi history
6. Nếu lỗi, ghi error message
7. Không dừng toàn bộ quá trình nếu một account lỗi
```

### 10.2 Auto Refresh

Auto refresh nên có interval mặc định:

```text
5 hoặc 10 phút
```

Không nên refresh quá nhanh.

Không khuyến khích:

```text
30 giây/lần
1 phút/lần nếu không cần thiết
```

### 10.3 Error Handling

Nếu check quota lỗi, app cần hiển thị lỗi rõ ràng:

```text
Profile not found
Account not logged in
Session expired
Could not detect quota
Timeout
Unknown error
```

Account lỗi nên chuyển sang status:

```text
Unknown
```

Không được tự xóa dữ liệu quota cũ nếu refresh lỗi. Chỉ cần đánh dấu dữ liệu có thể cũ.

## 11. Data Model Suggestion

### 11.1 Account Table

```text
accounts
- id
- nickname
- email_hint
- plan
- chrome_profile_name
- chrome_profile_path
- is_shared
- shared_with
- priority
- is_active
- note
- created_at
- updated_at
```

### 11.2 Quota Status Table

```text
quota_status
- id
- account_id
- quota_percent
- status
- reset_estimate
- last_checked_at
- source
- error_message
- created_at
- updated_at
```

### 11.3 Quota History Table

```text
quota_history
- id
- account_id
- quota_percent
- status
- reset_estimate
- source
- checked_at
- error_message
- note
- created_at
```

### 11.4 Settings Table

```text
settings
- id
- key
- value
- updated_at
```

## 12. Suggested Tech Stack

Preferred stack:

```text
Frontend: Next.js / React
Backend: Next.js API routes or Express
Database: SQLite
Runtime: Node.js
Automation: optional Playwright
Storage: local only
```

Alternative desktop stack:

```text
Tauri or Electron
SQLite
React UI
```

MVP nên ưu tiên web local app trước vì dễ làm và dễ test.

## 13. Development Phases

### Phase 1: Manual MVP

Mục tiêu: có dashboard an toàn dùng được ngay.

Yêu cầu:

```text
Account CRUD
Manual quota update
Status badge
Shared account notes
Last checked time
Quota history
Recommendation logic
CSV/JSON export
```

Phase này không cần auto refresh.

### Phase 2: Semi-Auto Refresh

Mục tiêu: giảm thao tác thủ công.

Yêu cầu:

```text
Map account to Chrome profile
Refresh one account
Refresh all accounts
Auto refresh interval
Error handling
Session expired warning
```

### Phase 3: Analytics

Mục tiêu: giúp người dùng hiểu usage pattern.

Yêu cầu:

```text
Quota history chart
Quota drop detection
Fast-drain warning
Daily/weekly summary
Recommended account ranking
Stale data warning
```

### Phase 4: Security Hardening

Mục tiêu: dùng lâu dài an toàn.

Yêu cầu:

```text
Local-only binding
Optional dashboard password
Backup/restore local data
Audit log
No secret scan check
Settings validation
```

## 14. Acceptance Criteria

Dự án được xem là đạt MVP nếu:

```text
Người dùng thêm được 8 account.
Mỗi account có nickname, email hint, plan, profile mapping.
Người dùng nhập quota thủ công được.
Dashboard hiển thị Green/Yellow/Red/Unknown.
Dashboard lưu lịch sử quota.
Dashboard ghi chú được account nào shared.
Dashboard gợi ý account nên dùng.
Dashboard cảnh báo nếu dữ liệu quota quá cũ.
Dashboard export được CSV hoặc JSON.
App không lưu password/cookie/token.
App chạy local trên localhost.
App không có proxy endpoint.
```

Phase 2 được xem là đạt nếu:

```text
Dashboard refresh được từng account theo Chrome profile riêng.
Dashboard refresh all account lần lượt.
Một account lỗi không làm hỏng toàn bộ refresh.
Dashboard ghi rõ lỗi refresh.
Dashboard vẫn cho nhập manual khi auto refresh lỗi.
```

## 15. Important Design Decisions

Các quyết định sau là bắt buộc:

```text
Use separate Chrome profile per account as the main source.
Do not use the main Chrome profile with many accounts for auto-check.
Manual mode must always exist.
Semi-auto refresh is optional but preferred.
Do not store Google secrets.
Do not build proxy.
Do not auto-rotate accounts.
Do not expose dashboard publicly.
Do not require other users to install an agent.
```

## 16. Final Summary

Dự án cần xây dựng một **local quota dashboard** để quản lý nhiều Google account AI Pro dùng với Antigravity.

Thiết kế đúng là:

```text
8 Google accounts
→ 8 separate Chrome profiles
→ Local dashboard maps each profile to one account
→ User can manually or semi-automatically refresh quota
→ Dashboard stores status/history/notes
→ Dashboard recommends which account to use
→ No password/cookie/token storage
→ No proxy
→ No account rotation
```

Mục tiêu cuối cùng là giúp người dùng quản lý quota an toàn, rõ ràng, dễ theo dõi, và tránh rủi ro của các công cụ router hoặc multi-account proxy.
