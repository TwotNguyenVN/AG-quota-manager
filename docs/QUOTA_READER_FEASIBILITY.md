# Quota Reader Feasibility Spike

## Tình trạng hiện tại (Status)
**Kết quả:** Chưa hoàn thành (Mock Reader đang được sử dụng tạm thời).

## Phân tích
Tại thời điểm khởi tạo dự án, chúng tôi chưa có phương pháp cụ thể nào được xác nhận để có thể đọc được quota thật của tài khoản Google trong Antigravity IDE một cách an toàn mà không vi phạm các nguyên tắc bảo mật:
1. **Không lưu trữ cookie hoặc OAuth token.**
2. **Không tự động đăng nhập thay người dùng.**

Do đó, chưa thể xây dựng `Real Antigravity Reader`.

## Hướng đi tạm thời (Workaround)
- Ứng dụng sẽ sử dụng **Mock Reader** trong môi trường development để kiểm thử luồng UI và API.
- Cảnh báo rõ ràng cho người dùng rằng tính năng Auto Quota Reader chưa hoạt động với dữ liệu thực.
- Tính năng **Manual Override** (nhập tay quota) sẽ được dùng làm fallback.

## Các giải pháp có thể nghiên cứu trong tương lai
1. **Trích xuất trạng thái cục bộ (Local State Extraction):** Kiểm tra xem Antigravity IDE có ghi log hoặc lưu trữ dữ liệu dung lượng cục bộ dưới dạng clear-text/JSON không.
2. **Sử dụng Headless Browser (Puppeteer/Playwright):** Mở Chrome profile mà người dùng đã chỉ định, truy cập trang quản lý của Antigravity để cào (scrape) số liệu quota. Phương pháp này chỉ chạy trên máy người dùng, an toàn hơn nếu không lưu lại phiên (session).
