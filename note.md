# Hiểu Biết Về Dự Án AG Quota Manager

Dựa trên các tài liệu đã đọc (`Plan.md`, `Phase.md`, `README.md`, và các rule trong thư mục `.agents/`), đây là tổng hợp sự hiểu biết của tôi về dự án:

## 1. Bản chất của dự án (What it is)
- Đây là một **local-first web dashboard** (chạy tại `localhost` trên máy tính cá nhân).
- **Mục đích:** Quản lý và theo dõi dung lượng (quota) của nhiều tài khoản Google có đăng ký gói AI Pro đang được dùng chung với Antigravity IDE.
- Tính năng cốt lõi (Core feature) là **Tự động đọc Quota (Auto quota reader)** và **Refresh All** các tài khoản.
- Tính năng phụ: Gợi ý account nên dùng, hiển thị lịch sử tụt quota, cảnh báo khi quota tụt nhanh hoặc session lỗi.
- Sẽ có một (tùy chọn) extension cho Antigravity IDE để xem quota nhanh từ status bar/sidebar.

## 2. Giới hạn nghiêm ngặt (What it is NOT - Security Rules)
- **Tuyệt đối không phải AI Router**: Không proxy request, không tạo OpenAI-compatible API (`/v1/chat/completions`), không tự động xoay vòng tài khoản (auto-rotate).
- **Bảo mật tuyệt đối (Zero secrets)**: Không lưu Google password, cookie, OAuth token, raw session.
- **Không Public**: Chỉ bind API và UI ở `127.0.0.1` hoặc `localhost`. Không mở ra `0.0.0.0`.
- Update quota thủ công (Manual override) chỉ được coi là fallback, không phải là hướng đi chính của tool.

## 3. Kiến trúc kỹ thuật (Tech Stack)
- **Frontend & Backend API**: Next.js (App Router), React, TypeScript, Tailwind CSS.
- **Database**: SQLite kết hợp với Prisma ORM. Local database là "source of truth".
- **Module Quota Reader**: Gồm 3 phần chính: Mock Reader (để test UI/API), Real Antigravity Reader (cần nghiên cứu tính khả thi), và Manual Override.

## 4. Lộ trình phát triển (Phase Roadmap)
Dự án được chia làm 18 phase, với những điểm bắt buộc tuân thủ:
- **Phase 0.5 (Spike)**: Cực kỳ quan trọng. Phải xác định rõ tính khả thi của việc đọc quota thật (từ local state, IDE, v.v.) mà không vi phạm quy tắc bảo mật. Nếu chỉ dùng Mock Reader thì không được coi là hoàn thành dự án.
- **Phase 1-3**: Xây dựng nền tảng Next.js, cấu hình Prisma, và tạo bộ Local API routes (tách biệt API ra trước UI).
- **Phase 4-10**: Xây dựng UI Mapping Profile, Reader system, tính năng Refresh One/All, Auto Scheduler, và Dashboard chính.
- **Phase 11-18**: Các tính năng Analytics, History, Fallback, Settings, Export/Import, Extension và đóng gói ứng dụng.

## 5. Thách thức lớn nhất (Biggest Challenge)
- Rào cản kỹ thuật khó nhất hiện tại nằm ở **Quota Reader Feasibility Spike (Phase 0.5)**: Làm sao để trích xuất được quota từ Antigravity/session một cách tự động mà không lưu giữ cookie, token hay password? (Có thể là quét local state files, chạy local script, hoặc check process?).
