# Chính sách Bảo mật (Security Policy)

AG Quota Manager được thiết kế với mục tiêu hàng đầu là **tuyệt đối an toàn** cho tài khoản Google của người dùng. Để đảm bảo điều này, dự án tuân thủ nghiêm ngặt các chính sách bảo mật sau:

## 1. Local-First (Chỉ hoạt động cục bộ)
- Ứng dụng chỉ được phép liên kết (bind) tới địa chỉ `127.0.0.1` hoặc `localhost`.
- Tuyệt đối không expose ứng dụng ra mạng ngoài (`0.0.0.0`) mặc định.
- Không có bất kỳ giao tiếp mạng nào tới các máy chủ bên ngoài để truyền dữ liệu người dùng.

## 2. No Secrets (Không lưu trữ thông tin nhạy cảm)
Dự án **tuyệt đối không** yêu cầu, thu thập, hay lưu trữ bất kỳ thông tin nào sau đây dưới mọi hình thức (database, file, bộ nhớ):
- Mật khẩu Google.
- Google Cookie hoặc Raw Browser Session.
- OAuth Refresh Token / Access Token.
- Mã 2FA hoặc Recovery Code.

## 3. Không chứa Proxy Endpoints
Ứng dụng chỉ làm nhiệm vụ **quản lý thông tin hạn mức**. Không cung cấp bất kỳ API nào có tính chất làm cầu nối (proxy) để thao tác với các dịch vụ bên ngoài, ví dụ như:
- `/v1/chat/completions`
- `/v1/models`
- `/proxy`
- `/rotate`

## 4. Audit Log Cơ bản
Mọi hành động quan trọng đều được lưu vết cục bộ để người dùng có thể đối chiếu:
- Thêm/Sửa/Xóa Account.
- Cập nhật Quota thủ công.
- Thay đổi cài đặt cấu hình.
- Xuất/Backup dữ liệu.
