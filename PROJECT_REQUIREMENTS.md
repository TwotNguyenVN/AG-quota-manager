# Yêu cầu Dự án (Project Requirements) - AG Quota Manager

## 1. Mục tiêu
AG Quota Manager là một Dashboard quản trị cục bộ (Local Web App) giúp theo dõi, quản lý, và gợi ý việc sử dụng hạn mức (quota) của các tài khoản (Google Accounts / Profiles). 
Dự án được triển khai theo nhiều giai đoạn, trong đó MVP tập trung hoàn toàn vào việc quản lý dữ liệu thủ công, đảm bảo an toàn tuyệt đối và có thể dùng được ngay lập tức.

## 2. Các Tính năng Cốt lõi (MVP - Phase 2)

### 2.1 Quản lý Tài khoản (Account CRUD)
- Thêm, sửa, xóa, và vô hiệu hóa (enable/disable) tài khoản.
- Các trường dữ liệu chính: `Nickname`, `Email hint`, `Plan`, `Chrome profile name`, `Chrome profile path`, `Shared status`, `Shared with`, `Priority`, `Note`, `Active/Inactive`.

### 2.2 Cập nhật Quota Thủ công
- Ghi nhận: `Quota percent`, `Status`, `Reset estimate`, `Note`, `Checked time`.

### 2.3 Phân loại Trạng thái (Status Badge)
- **Green**: > 50% (còn nhiều).
- **Yellow**: 20% - 50% (trung bình).
- **Red**: < 20% (gần hết).
- **Locked**: Bị giới hạn/khóa.
- **Unknown**: 0% / Chưa có dữ liệu.

### 2.4 Bảng Điều khiển (Dashboard)
- Bảng hiển thị danh sách tài khoản kèm trạng thái quota.
- Gợi ý tài khoản tốt nhất để sử dụng dựa trên quota hiện tại và trạng thái share.
- Cảnh báo dữ liệu đã cũ (stale data).

## 3. Kiến trúc Hệ thống
- **Frontend**: Next.js (App Router), React, Tailwind CSS.
- **Database**: SQLite (qua Prisma ORM).
- **Môi trường chạy**: Node.js, `localhost` (127.0.0.1).

## 4. Ranh giới Dự án (Non-goals)
- **KHÔNG** lưu trữ mật khẩu, cookie, token của Google.
- **KHÔNG** hoạt động như một Proxy API để định tuyến request.
- **KHÔNG** tự động luân chuyển (rotate) tài khoản trong proxy.
- Ở giai đoạn MVP, **KHÔNG** tự động refresh quota (mọi thứ làm thủ công).
