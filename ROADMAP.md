# Lộ trình Phát triển (Roadmap) - AG Quota Manager

Dự án được chia thành các giai đoạn phát triển cụ thể, từ bản đơn giản, an toàn nhất đến bản hoàn chỉnh có tích hợp tự động hóa.

## Phase 0: Requirement & Scope Lock (Đã hoàn thành)
- Chốt tên, mô tả dự án và tính năng MVP.
- Chuẩn hóa tài liệu: PROJECT_REQUIREMENTS.md, SECURITY_POLICY.md, ROADMAP.md.

## Phase 1: Project Foundation (Đang thực hiện)
- Khởi tạo project Next.js (App Router, TypeScript, Tailwind).
- Cấu hình SQLite + Prisma ORM.
- Khởi tạo cấu trúc thư mục rỗng chuẩn bị cho tính năng.

## Phase 2: Manual MVP (Mục tiêu tiếp theo)
- Quản lý tài khoản (CRUD).
- Nhập hạn mức (quota) thủ công.
- Hiển thị badge trạng thái (Green, Yellow, Red, Locked).
- Bảng Dashboard hiển thị và gọi ý tài khoản.

## Phase 3: Quota History & Recommendation
- Lưu lịch sử quota mỗi lần cập nhật.
- Xây dựng hệ thống gợi ý tài khoản thông minh.
- Cảnh báo dữ liệu đã cũ (stale data).

## Phase 4: Semi-Auto Refresh Prototype
- Xây dựng module đọc quota cơ bản, thử nghiệm tính năng refresh 1 tài khoản (bán tự động).

## Phase 5: Chrome Profile Mapping & Refresh All
- Ánh xạ tài khoản với Chrome Profile tương ứng.
- Tính năng Refresh toàn bộ tài khoản (tuần tự).
- Cho phép bật/tắt Auto Refresh (5-10 phút/lần).

## Phase 6: Analytics & Smart Alerts
- Phát hiện rớt quota bất thường (Quota Drop Detection).
- Cảnh báo account tụt quota nhanh.
- Biểu đồ thống kê và tóm tắt theo ngày/tuần.

## Phase 7: Security Hardening
- Đảm bảo app chỉ bind local.
- Audit log chi tiết.
- Tùy chọn khóa local dashboard (Dashboard Lock).

## Phase 8: Packaging & Release
- Đóng gói dự án để dễ dàng cài đặt.
- Cung cấp tài liệu INSTALL.md và USAGE.md chi tiết.

## Phase 9: Maintenance & Improvement
- Theo dõi và bảo trì, dự phòng thay đổi từ Antigravity/Google.
- Đảm bảo Manual mode luôn khả dụng như một phương án an toàn.
