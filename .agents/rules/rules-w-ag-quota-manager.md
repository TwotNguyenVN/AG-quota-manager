---
trigger: always_on
---


# Quy tắc Git & GitHub
- Với bất kì thay đổi hay cập nhật, phát triển hay fix bug đều phải commit và push lên GitHub trên các nhánh đang có hoặc tạo mới (tùy tình huống).
- Phải dùng đúng định dạng Conventional Commits:
  - `feat`: chức năng mới.
  - `fix`: sửa lỗi.
  - `docs`: tài liệu.
  - `style`: format, không đổi logic.
  - `refactor`: tái cấu trúc, không thêm tính năng.
  - `test`: thêm/sửa test.
  - `chore`: config hoặc việc phụ trợ.
  - `build`: dependency/build.
  - `ci`: GitHub Actions/CI.
  - `perf`: tối ưu hiệu năng.
  - `revert`: hoàn tác thay đổi.
- SAU ĐÓ: Phải tạo Pull Request (PR) và merge vào nhánh `main`.
- TUYỆT ĐỐI KHÔNG ĐƯỢC push/merge trực tiếp vào nhánh `main`. Luôn luôn tạo nhánh mới và mở PR.
