# IIT Publications

Hệ thống website xuất bản phẩm điện tử gồm:

- Backend: NestJS + Prisma + SQLite
- Frontend: Vite + React + TypeScript + shadcn-style UI + Radix UI

## Chức năng chính

- Trang chủ công khai hiển thị danh sách xuất bản phẩm `Đã phát hành` và `Tạm ngưng`
- Tìm kiếm theo `tiêu đề` hoặc `tác giả`
- Trang upload công khai cho phép tải nhiều tệp và nhập metadata
- Quản trị viên đăng nhập bằng tài khoản cố định:
  - username: `admin`
  - password: `iit@123`
- Admin có thể:
  - phát hành xuất bản phẩm
  - gỡ bỏ mềm xuất bản phẩm
  - bắt buộc nhập ghi chú xử lý
  - theo dõi lịch sử thao tác
- Xuất bản phẩm `Tạm ngưng` khi mở chi tiết sẽ hiện thông báo:
  - `Nội dung không còn khả dụng`

## Cấu trúc thư mục

- `apps/api`: NestJS API
- `apps/web`: Vite React frontend
- `storage/uploads`: nơi lưu tệp upload
- `docs/superpowers/specs`: spec thiết kế
- `docs/superpowers/plans`: implementation plan

## Cài đặt

```bash
npm install
```

## Chuẩn bị database

```bash
npm run db:generate
npm --workspace apps/api run prisma:push
npm --workspace apps/api run prisma:seed
```

## Chạy môi trường phát triển

Mở 2 terminal:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

Frontend mặc định gọi API tại `http://localhost:3000`.

## Kiểm thử

```bash
npm --workspace apps/api run test
npm --workspace apps/api run test:e2e -- admin-auth.e2e-spec.ts
npm --workspace apps/api run test:e2e -- publication-workflow.e2e-spec.ts
npm --workspace apps/web run test
```

## Build

```bash
npm --workspace apps/api run build
npm --workspace apps/web run build
```

## Chạy bằng Docker

Build và chạy toàn bộ stack:

```bash
docker compose up --build -d
```

Dừng stack:

```bash
docker compose down
```

Truy cập:

- API: `http://localhost:6021`
- Website: `http://localhost:6022`

Ghi chú Docker:

- API trong container vẫn chạy cổng `3000`, được map ra ngoài thành `6021`.
- Website chạy qua Nginx cổng `80`, được map ra ngoài thành `6022`.
- Frontend gọi API qua đường dẫn `/api` và được Nginx proxy sang service `api`.
- SQLite và thư mục upload được lưu trên volume Docker `iit_publications_data`.

## Ghi chú

- Toàn bộ nội dung tiếng Việt trong mã nguồn được lưu theo UTF-8.
- Dự án hiện dùng lưu trữ tệp cục bộ cho MVP.
- Tài khoản người dùng công khai chưa cần đăng nhập.
