# Thiết kế hệ thống xuất bản phẩm điện tử IIT

## Mục tiêu

Xây dựng website xuất bản phẩm điện tử gồm frontend và backend cho phép:

- Người dùng công khai tải lên nhiều tệp kèm metadata.
- Hệ thống lưu bản ghi ở trạng thái `Đang chờ duyệt`.
- Quản trị viên đăng nhập bằng tài khoản cố định `admin / iit@123`.
- Quản trị viên kiểm tra và thao tác `Phát hành` hoặc `Gỡ bỏ`.
- `Gỡ bỏ` là xóa mềm, chuyển trạng thái thành `Tạm ngưng`.
- Ghi lịch sử thao tác đầy đủ cho upload, cập nhật, phát hành, gỡ bỏ.
- Danh sách công khai hiển thị `Đã phát hành` và `Tạm ngưng`; bản `Tạm ngưng` bị khóa khi mở chi tiết.

## Kiến trúc

- Monorepo với hai ứng dụng:
  - `apps/api`: NestJS REST API.
  - `apps/web`: Vite + React + TypeScript.
- Cơ sở dữ liệu chính: SQLite.
- ORM: Prisma.
- Tệp upload được lưu cục bộ trong `storage/uploads`.
- Frontend gọi API REST để lấy danh sách, upload, quản trị và xem chi tiết.

## Nghiệp vụ chính

### 1. Khu công khai

- Trang chủ hiển thị danh sách xuất bản phẩm ở trạng thái `Đã phát hành` và `Tạm ngưng`.
- Có tìm kiếm theo `tiêu đề` hoặc `tác giả/đơn vị gửi`.
- Bản `Tạm ngưng` vẫn hiển thị trên danh sách nhưng có nhãn khóa.
- Khi vào chi tiết bản `Tạm ngưng`, hiển thị thông báo `Nội dung không còn khả dụng`.
- Bản `Đã phát hành` cho phép xem preview và tải tệp.

### 2. Upload công khai

- Người dùng không cần đăng nhập.
- Form bắt buộc:
  - Tiêu đề
  - Mô tả ngắn
  - Tác giả/đơn vị gửi
  - Năm xuất bản
  - Ngày hết hạn bản quyền
  - Nhiều tệp đính kèm
- Sau khi upload thành công, hệ thống tạo:
  - `Publication`
  - danh sách `PublicationFile`
  - lịch sử thao tác `UPLOAD`
- Trạng thái ban đầu là `Đang chờ duyệt`.

### 3. Quản trị

- Trang đăng nhập riêng cho admin.
- Tài khoản cố định:
  - username: `admin`
  - password: `iit@123`
- Quản trị có thể:
  - Xem danh sách chờ duyệt
  - Xem chi tiết metadata và tệp
  - Nhập ghi chú bắt buộc khi `Phát hành`
  - Nhập ghi chú bắt buộc khi `Gỡ bỏ`
- `Phát hành` chuyển trạng thái thành `Đã phát hành`.
- `Gỡ bỏ` chuyển trạng thái thành `Tạm ngưng`.
- Mọi thao tác quản trị ghi vào lịch sử.

### 4. Lịch sử thao tác

- Bảng lịch sử ghi:
  - thời điểm
  - loại thao tác
  - người thao tác
  - ghi chú
  - trạng thái trước/sau
- Lịch sử cần bao phủ tối thiểu:
  - upload
  - chỉnh sửa metadata
  - phát hành
  - gỡ bỏ

## Mô hình dữ liệu

### Publication

- `id`
- `title`
- `description`
- `author`
- `publishYear`
- `copyrightExpiryDate`
- `status`
- `createdAt`
- `updatedAt`

### PublicationFile

- `id`
- `publicationId`
- `originalName`
- `storedName`
- `mimeType`
- `extension`
- `size`
- `relativePath`
- `createdAt`

### PublicationHistory

- `id`
- `publicationId`
- `action`
- `actor`
- `note`
- `previousStatus`
- `nextStatus`
- `createdAt`

## Trạng thái

- `PENDING`: Đang chờ duyệt
- `PUBLISHED`: Đã phát hành
- `SUSPENDED`: Tạm ngưng

## Preview tệp

- PDF: nhúng xem trực tiếp bằng thẻ `iframe` hoặc `object`.
- Hình ảnh: hiển thị trực tiếp.
- Video: phát bằng `video`.
- Audio: phát bằng `audio`.
- Các loại khác: hiển thị thẻ tệp với nút tải.

## API chính

- `POST /publications/upload`
- `GET /publications`
- `GET /publications/:id`
- `GET /publications/:id/files/:fileId/content`
- `POST /admin/login`
- `GET /admin/publications`
- `PATCH /admin/publications/:id/publish`
- `PATCH /admin/publications/:id/suspend`
- `GET /admin/publications/:id/history`

## Thiết kế giao diện

### Công khai

- Trang chủ theo phong cách editorial hiện đại.
- Hero ngắn, thanh tìm kiếm rõ.
- Card danh sách thể hiện:
  - tiêu đề
  - tác giả
  - năm xuất bản
  - trạng thái
  - nhãn khóa nếu tạm ngưng
- Trang chi tiết có:
  - metadata
  - vùng preview theo loại tệp
  - danh sách tệp tải về

### Quản trị

- Bố cục rõ ràng, ưu tiên bảng và panel chi tiết.
- Danh sách chờ duyệt, đã phát hành, tạm ngưng.
- Modal xác nhận thao tác có ô ghi chú bắt buộc.
- Mục lịch sử thao tác theo dòng thời gian.

## Yêu cầu kỹ thuật

- Toàn bộ dự án dùng UTF-8.
- Giao diện dùng shadcn UI và Radix UI.
- Frontend dùng TypeScript.
- Backend dùng NestJS.
- Database chính dùng SQLite.

## Kiểm thử

- Backend:
  - test logic chuyển trạng thái
  - test đăng nhập admin
  - test upload tạo đúng dữ liệu và lịch sử
- Frontend:
  - test render trạng thái
  - test hành vi khóa với bản `Tạm ngưng`
  - test form upload

## Giới hạn của MVP

- Chỉ có một tài khoản quản trị cứng.
- Lưu tệp cục bộ, chưa tích hợp object storage.
- Chưa có tài khoản người dùng công khai.
- Chưa có phân loại chủ đề, thống kê nâng cao hoặc phân quyền nhiều cấp.
