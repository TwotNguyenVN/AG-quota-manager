Dưới đây là các **giai đoạn phát triển cụ thể** cho dự án **AG Quota Manager**, đi từ bản đơn giản/an toàn nhất đến bản hoàn chỉnh.

# Tổng quan lộ trình

```text
Phase 0 → Chuẩn hóa yêu cầu
Phase 1 → Khởi tạo project
Phase 2 → Manual MVP
Phase 3 → Quota History + Recommendation
Phase 4 → Semi-Auto Refresh Prototype
Phase 5 → Chrome Profile Mapping + Refresh All
Phase 6 → Analytics + Cảnh báo
Phase 7 → Security Hardening
Phase 8 → Packaging + Release
Phase 9 → Maintenance
```

Mình khuyên bạn **không bắt đầu bằng auto refresh ngay**. Nên làm dashboard manual trước, vì nó an toàn, dễ test, và có thể dùng được ngay.

---

# Phase 0 — Requirement & Scope Lock

## Mục tiêu

Chốt rõ dự án này là **quota dashboard**, không phải proxy, không phải router, không phải tool xoay account.

## Việc cần làm

* Chốt tên dự án: **AG Quota Manager**.
* Chốt mô tả dự án.
* Chốt danh sách tính năng MVP.
* Chốt những thứ không được làm.
* Chốt data model cơ bản.
* Chốt tech stack.

## Kết quả cần có

```text
README.md
PROJECT_REQUIREMENTS.md
SECURITY_POLICY.md
ROADMAP.md
```

## Điều kiện hoàn thành

Phase này xong khi AI agent hoặc developer đọc tài liệu và hiểu rõ:

```text
App chỉ quản lý quota.
Không lưu password/cookie/token.
Không proxy.
Không auto-rotate account.
Manual mode là bắt buộc.
Semi-auto refresh là phase sau.
```

---

# Phase 1 — Project Foundation

## Mục tiêu

Tạo nền tảng code sạch để phát triển dashboard.

## Tech stack đề xuất

```text
Frontend: Next.js + React
Styling: Tailwind CSS
Database: SQLite
ORM: Prisma hoặc Drizzle
Runtime: Node.js
App type: Local web app
Default host: localhost / 127.0.0.1
```

## Việc cần làm

* Tạo project Next.js.
* Cấu hình TypeScript.
* Cấu hình Tailwind.
* Cấu hình SQLite.
* Tạo layout chính.
* Tạo navigation cơ bản.
* Tạo cấu trúc thư mục.

## Cấu trúc thư mục đề xuất

```text
ag-quota-manager/
├── app/
│   ├── dashboard/
│   ├── accounts/
│   ├── history/
│   ├── settings/
│   └── api/
├── components/
├── lib/
├── db/
├── scripts/
├── docs/
├── README.md
└── package.json
```

## Kết quả cần có

App chạy được local:

```bash
npm run dev
```

Mở được:

```text
http://localhost:3000
```

## Điều kiện hoàn thành

* App chạy local.
* Có giao diện dashboard trống.
* Có trang Accounts.
* Có trang Settings.
* Có database local.
* Chưa cần refresh quota thật.

---

# Phase 2 — Manual MVP

Đây là phase quan trọng nhất.

## Mục tiêu

Làm bản đầu tiên dùng được ngay, không cần automation.

Người dùng có thể tự nhập quota của từng account, dashboard sẽ quản lý, hiển thị trạng thái và gợi ý account nên dùng.

## Tính năng cần làm

### 2.1 Account CRUD

Cho phép:

```text
Add account
Edit account
Delete account
Enable/disable account
```

Mỗi account có:

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
Nickname: AG-01
Email hint: acc01@gmail.com
Plan: AI Pro
Chrome Profile: AG-01
Shared: No
Priority: High
Note: Main coding account
```

### 2.2 Manual Quota Update

Cho phép nhập:

```text
Quota percent
Status
Reset estimate
Note
Checked time
```

Ví dụ:

```text
AG-01
Quota: 82%
Status: Green
Reset estimate: 3h
Note: checked from Antigravity
```

### 2.3 Status Badge

Hiển thị trạng thái:

```text
Green   → còn nhiều quota
Yellow  → quota trung bình
Red     → gần hết hoặc hết
Locked  → đang bị giới hạn
Unknown → chưa có dữ liệu
```

Ngưỡng mặc định:

```text
Green  > 50%
Yellow 20–50%
Red    < 20%
Empty  = 0%
```

### 2.4 Dashboard Table

Trang chính cần có bảng:

```text
Account | Plan | Quota | Status | Shared | Last Checked | Recommendation | Actions
```

Actions:

```text
Edit
Update quota
View history
Mark as avoid
```

## Kết quả cần có

Người dùng thêm được 8 account và quản lý quota thủ công.

## Điều kiện hoàn thành

Phase 2 hoàn thành khi:

```text
Thêm được account.
Sửa được account.
Xóa được account.
Nhập quota thủ công được.
Dashboard hiển thị đúng Green/Yellow/Red.
Có last checked.
Có note account shared.
Có recommendation cơ bản.
Không có auto refresh.
Không lưu secret.
```

---

# Phase 3 — Quota History & Recommendation

## Mục tiêu

Lưu lịch sử quota và gợi ý account nên dùng.

## Tính năng cần làm

### 3.1 Quota History

Mỗi lần update quota phải lưu history.

History record:

```text
Account ID
Quota percent
Status
Source: manual
Checked at
Reset estimate
Note
```

### 3.2 History Page

Có trang xem lịch sử:

```text
All history
History by account
Today
Last 7 updates
Last 30 updates
```

### 3.3 Recommendation Logic

Logic gợi ý account:

```text
Quota > 50% + not shared → ưu tiên cao
Quota > 50% + shared → ưu tiên trung bình
Quota 20–50% → chỉ dùng task nhỏ
Quota < 20% → tránh dùng
Quota = 0% → không dùng
Locked → không dùng
Unknown → cần refresh
```

Dashboard nên hiển thị:

```text
Recommended account: AG-01
Reason: quota còn 82%, không shared, last checked gần đây.
```

### 3.4 Stale Data Warning

Nếu quota check quá lâu, cảnh báo:

```text
Fresh      → dưới 10 phút
Maybe old  → 10–30 phút
Stale      → trên 30 phút
Very stale → trên 2 giờ
```

## Kết quả cần có

Dashboard không chỉ hiện quota hiện tại, mà còn có lịch sử và gợi ý account nên dùng.

## Điều kiện hoàn thành

```text
Mỗi lần update quota đều lưu history.
Xem được history theo account.
Dashboard gợi ý account tốt nhất.
Dashboard cảnh báo nếu dữ liệu quota đã cũ.
```

---

# Phase 4 — Semi-Auto Refresh Prototype

## Mục tiêu

Thử nghiệm cơ chế refresh quota bán tự động, nhưng chưa cần hoàn hảo.

Phase này là **prototype**, không phải tính năng bắt buộc phải ổn định ngay.

## Việc cần làm

* Tạo module `quota-reader`.
* Tạo interface chung cho quota reader.
* Chuẩn bị cơ chế refresh một account.
* Nếu không đọc được quota thì trả về error rõ ràng.
* Không lưu password/cookie/token.

## Interface đề xuất

```ts
type QuotaRefreshResult = {
  accountId: string;
  success: boolean;
  quotaPercent?: number;
  status?: "green" | "yellow" | "red" | "locked" | "unknown";
  resetEstimate?: string;
  checkedAt: string;
  errorMessage?: string;
};
```

## Cách hoạt động mong muốn

```text
User bấm Refresh AG-01
→ App dùng profile mapping của AG-01
→ Thử check quota
→ Nếu thành công: update quota + ghi history
→ Nếu lỗi: giữ data cũ + ghi error
```

## Kết quả cần có

Có nút **Refresh one account**, dù ban đầu có thể chỉ là mock hoặc experimental.

## Điều kiện hoàn thành

```text
Có module refresh riêng.
Có nút Refresh cho từng account.
Refresh lỗi không làm crash app.
Lỗi được ghi rõ.
Manual update vẫn dùng được.
Không lưu secret.
```

---

# Phase 5 — Chrome Profile Mapping & Refresh All

## Mục tiêu

Cho phép dashboard map từng account với Chrome Profile riêng và refresh lần lượt nhiều account.

## Tính năng cần làm

### 5.1 Profile Mapping

Mỗi account có:

```text
Chrome profile name
Chrome profile path
Browser type
Is profile verified?
Last profile check
```

Ví dụ:

```text
AG-01 → Chrome Profile AG-01
AG-02 → Chrome Profile AG-02
AG-03 → Chrome Profile AG-03
```

### 5.2 Refresh All

Nút **Refresh All** cần làm:

```text
1. Lấy danh sách account active.
2. Check từng account một.
3. Account nào thành công thì update quota.
4. Account nào lỗi thì ghi error.
5. Không dừng toàn bộ nếu một account lỗi.
6. Ghi history cho từng account.
```

### 5.3 Auto Refresh

Cho phép bật/tắt auto refresh.

Mặc định nên là:

```text
5 hoặc 10 phút/lần
```

Không nên refresh quá nhanh.

## Kết quả cần có

Dashboard có thể refresh nhiều account theo thứ tự.

## Điều kiện hoàn thành

```text
Map được account với Chrome Profile.
Refresh được từng account.
Refresh All chạy lần lượt.
Một account lỗi không làm hỏng account khác.
Auto refresh bật/tắt được.
Manual fallback vẫn tồn tại.
```

---

# Phase 6 — Analytics & Smart Alerts

## Mục tiêu

Biến dashboard từ “bảng ghi quota” thành công cụ phân tích usage/quota hữu ích.

## Tính năng cần làm

### 6.1 Quota Drop Detection

Phát hiện account tụt quota bất thường.

Ví dụ:

```text
AG-03 giảm từ 80% xuống 40% trong lần refresh gần nhất.
```

Hiển thị cảnh báo:

```text
Unexpected quota drop detected.
This account may have been used by someone else.
```

### 6.2 Fast Drain Warning

Nếu account giảm nhanh nhiều lần:

```text
AG-02 appears to be draining quickly.
Consider avoiding this account for heavy tasks.
```

### 6.3 Usage Summary

Có summary:

```text
Today summary
Last 7 days summary
Most used account
Most stable account
Shared account with highest drop
Best account to use now
```

### 6.4 Charts

Có thể thêm biểu đồ:

```text
Quota over time
Quota drop by account
Account status distribution
```

## Kết quả cần có

Người dùng không chỉ biết quota hiện tại, mà còn hiểu account nào đang bị dùng nhiều.

## Điều kiện hoàn thành

```text
Có phát hiện quota drop.
Có cảnh báo account tụt nhanh.
Có summary theo ngày/tuần.
Có chart hoặc bảng analytics.
```

---

# Phase 7 — Security Hardening

## Mục tiêu

Đảm bảo app an toàn khi dùng lâu dài.

## Yêu cầu bảo mật bắt buộc

### 7.1 Local Only

App chỉ bind:

```text
127.0.0.1
localhost
```

Không mặc định bind:

```text
0.0.0.0
```

### 7.2 No Secrets

App không lưu:

```text
Google password
Google cookie
OAuth refresh token
Access token
2FA code
Recovery code
Raw browser session
```

### 7.3 No Proxy Endpoint

Không có endpoint kiểu:

```text
/v1/chat/completions
/v1/models
/proxy
/rotate
```

### 7.4 Optional Dashboard Lock

Có thể thêm local password để mở dashboard.

Lưu ý: password này chỉ để khóa dashboard local, không liên quan Google account.

### 7.5 Audit Log

Ghi lại:

```text
Account added
Account edited
Quota updated
Refresh started
Refresh failed
Settings changed
Export created
```

## Kết quả cần có

App an toàn hơn, rõ ràng hơn, tránh bị biến thành tool nguy hiểm.

## Điều kiện hoàn thành

```text
App chỉ chạy local.
Không lưu secret.
Không có proxy endpoint.
Có security policy.
Có audit log cơ bản.
Có manual fallback.
```

---

# Phase 8 — Packaging & Release

## Mục tiêu

Đóng gói để dùng dễ hơn, không phải setup phức tạp mỗi lần.

## Option 1: Local Web App

Lệnh chạy:

```bash
npm install
npm run dev
```

Hoặc production:

```bash
npm run build
npm start
```

## Option 2: Desktop App

Sau này có thể đóng gói bằng:

```text
Tauri
Electron
```

## Tài liệu cần có

```text
README.md
INSTALL.md
USAGE.md
SECURITY.md
ROADMAP.md
CHANGELOG.md
```

## Kết quả cần có

Người dùng clone repo và chạy được app local.

## Điều kiện hoàn thành

```text
Có hướng dẫn cài đặt rõ ràng.
Có hướng dẫn thêm account.
Có hướng dẫn manual update.
Có hướng dẫn refresh quota.
Có hướng dẫn backup/export.
Có cảnh báo security rõ ràng.
```

---

# Phase 9 — Maintenance & Improvement

## Mục tiêu

Duy trì dự án ổn định nếu Antigravity/Google thay đổi cách hiển thị quota.

## Việc cần làm

* Theo dõi lỗi refresh.
* Không để auto refresh là phụ thuộc duy nhất.
* Manual mode luôn tồn tại.
* Cập nhật quota reader nếu cần.
* Backup dữ liệu local.
* Cải thiện UI/UX.
* Cải thiện recommendation logic.

## Nguyên tắc duy trì

```text
Manual mode must never be removed.
No secret storage.
No proxy.
No auto-rotation.
Local-first.
User remains in control.
```

---

# Thứ tự ưu tiên nên làm

Nếu muốn hoàn thiện đúng hướng, đi theo thứ tự này:

```text
1. Project setup
2. Account CRUD
3. Manual quota update
4. Status badge
5. Quota history
6. Recommendation logic
7. Stale data warning
8. Export CSV/JSON
9. Profile mapping
10. Refresh one account
11. Refresh all accounts
12. Auto refresh
13. Analytics
14. Security hardening
15. Packaging
```

---

# MVP nhỏ nhất nên đạt trước

MVP nhỏ nhất không cần auto refresh.

Chỉ cần:

```text
Thêm 8 account
Nhập quota thủ công
Hiển thị trạng thái quota
Ghi chú shared account
Lưu history
Gợi ý account nên dùng
Cảnh báo data cũ
Export JSON/CSV
Không lưu secret
Không proxy
```

Đây là bản đầu tiên nên làm trước, vì **an toàn, nhanh kiểm chứng, và dùng được ngay**.

---

# Bản hoàn chỉnh nên đạt

Bản hoàn chỉnh nên có:

```text
Account management đầy đủ
Manual quota update
Semi-auto refresh theo Chrome Profile riêng
Refresh All
Auto refresh 5–10 phút/lần
Quota history
Quota drop detection
Shared account warning
Recommendation engine
Analytics dashboard
Export/backup
Audit log
Local dashboard lock
Security policy
Packaging hướng dẫn rõ ràng
```

---

# Kết luận

Lộ trình tốt nhất cho dự án này là:

```text
Manual Dashboard trước
→ History + Recommendation
→ Semi-Auto Refresh
→ Analytics
→ Security Hardening
→ Packaging
```

Không nên bắt đầu bằng proxy hoặc auto account switching.

Mục tiêu cuối cùng là tạo một công cụ:

```text
An toàn
Local-first
Không lưu secret
Không proxy
Không auto-rotate account
Quản lý quota rõ ràng
Có thể mở rộng lên semi-auto refresh
```

Đây là hướng phù hợp nhất với nhu cầu của bạn.
