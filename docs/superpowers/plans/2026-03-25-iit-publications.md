# IIT Publications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng monorepo gồm NestJS backend và Vite React frontend cho hệ thống xuất bản phẩm điện tử có upload công khai, duyệt phát hành, tạm ngưng và lịch sử thao tác.

**Architecture:** Monorepo dùng npm workspaces với `apps/api` và `apps/web`. Backend NestJS dùng Prisma + SQLite và lưu tệp cục bộ; frontend Vite React dùng shadcn UI, gọi REST API và hiển thị preview đa định dạng.

**Tech Stack:** NestJS, Prisma, SQLite, React, Vite, TypeScript, shadcn UI, Radix UI, Vitest, Testing Library

---

## Cấu trúc file dự kiến

- Root:
  - `package.json`
  - `tsconfig.base.json`
  - `.gitignore`
  - `README.md`
- Backend:
  - `apps/api/src/main.ts`
  - `apps/api/src/app.module.ts`
  - `apps/api/src/modules/auth/*`
  - `apps/api/src/modules/publications/*`
  - `apps/api/prisma/schema.prisma`
  - `apps/api/prisma/seed.ts`
  - `apps/api/test/*`
- Frontend:
  - `apps/web/src/main.tsx`
  - `apps/web/src/App.tsx`
  - `apps/web/src/pages/*`
  - `apps/web/src/components/*`
  - `apps/web/src/lib/*`
  - `apps/web/src/test/*`

## Task 1: Scaffold monorepo

**Files:**
- Create: `package.json`
- Create: `apps/api/*`
- Create: `apps/web/*`
- Create: `.gitignore`

- [ ] Viết cấu hình root workspaces.
- [ ] Scaffold NestJS app trong `apps/api`.
- [ ] Scaffold Vite React TS app trong `apps/web`.
- [ ] Cài dependency chung cần thiết.
- [ ] Chạy build cơ bản để xác nhận hai app khởi tạo thành công.

## Task 2: Thiết lập backend data layer

**Files:**
- Create: `apps/api/prisma/schema.prisma`
- Create: `apps/api/src/modules/prisma/*`
- Test: `apps/api/test/publication-status.spec.ts`

- [ ] Viết test logic trạng thái `PENDING -> PUBLISHED` và `PENDING/PUBLISHED -> SUSPENDED`.
- [ ] Chạy test để thấy thất bại ban đầu.
- [ ] Tạo Prisma schema cho `Publication`, `PublicationFile`, `PublicationHistory`.
- [ ] Tạo service hoặc helper xử lý chuyển trạng thái tối thiểu để test pass.
- [ ] Chạy lại test xác nhận pass.

## Task 3: Upload công khai

**Files:**
- Create: `apps/api/src/modules/publications/public-upload.*`
- Test: `apps/api/test/public-upload.spec.ts`

- [ ] Viết test cho API upload tạo publication, files, history.
- [ ] Chạy test để thấy fail.
- [ ] Cài multipart upload, validation DTO và lưu file cục bộ.
- [ ] Ghi lịch sử `UPLOAD`.
- [ ] Chạy test lại xác nhận pass.

## Task 4: Đăng nhập admin

**Files:**
- Create: `apps/api/src/modules/auth/*`
- Test: `apps/api/test/admin-auth.spec.ts`

- [ ] Viết test đăng nhập đúng/sai thông tin `admin / iit@123`.
- [ ] Chạy test để thấy fail.
- [ ] Cài auth tối thiểu bằng session hoặc JWT đơn giản.
- [ ] Bảo vệ các route `/admin/*`.
- [ ] Chạy test lại xác nhận pass.

## Task 5: Duyệt phát hành và gỡ bỏ

**Files:**
- Modify: `apps/api/src/modules/publications/*`
- Test: `apps/api/test/admin-review.spec.ts`

- [ ] Viết test cho `publish` và `suspend` yêu cầu ghi chú bắt buộc.
- [ ] Chạy test để thấy fail.
- [ ] Cài API phát hành/tạm ngưng.
- [ ] Ghi lịch sử với trạng thái trước/sau và ghi chú.
- [ ] Chạy test lại xác nhận pass.

## Task 6: API công khai và preview

**Files:**
- Modify: `apps/api/src/modules/publications/*`
- Test: `apps/api/test/public-query.spec.ts`

- [ ] Viết test cho danh sách công khai chỉ trả `PUBLISHED` và `SUSPENDED`.
- [ ] Viết test cho chi tiết `SUSPENDED` trả cờ khóa nội dung.
- [ ] Chạy test để thấy fail.
- [ ] Cài query, search theo tiêu đề/tác giả và endpoint content cho file.
- [ ] Chạy test lại xác nhận pass.

## Task 7: UI công khai

**Files:**
- Create: `apps/web/src/pages/home-page.tsx`
- Create: `apps/web/src/pages/upload-page.tsx`
- Create: `apps/web/src/pages/publication-detail-page.tsx`
- Test: `apps/web/src/test/public-pages.spec.tsx`

- [ ] Viết test render card trạng thái và thông báo khóa nội dung.
- [ ] Chạy test để thấy fail.
- [ ] Tạo layout công khai, tìm kiếm, danh sách, upload form và trang chi tiết.
- [ ] Thêm preview cho PDF, ảnh, video, audio và thẻ tải file khác.
- [ ] Chạy test lại xác nhận pass.

## Task 8: UI quản trị

**Files:**
- Create: `apps/web/src/pages/admin-login-page.tsx`
- Create: `apps/web/src/pages/admin-dashboard-page.tsx`
- Test: `apps/web/src/test/admin-pages.spec.tsx`

- [ ] Viết test cho đăng nhập admin và modal ghi chú bắt buộc.
- [ ] Chạy test để thấy fail.
- [ ] Tạo trang đăng nhập, dashboard danh sách và lịch sử thao tác.
- [ ] Kết nối API phát hành/tạm ngưng.
- [ ] Chạy test lại xác nhận pass.

## Task 9: Hoàn thiện trải nghiệm và dữ liệu mẫu

**Files:**
- Create: `apps/api/prisma/seed.ts`
- Modify: `apps/web/src/styles/*` hoặc CSS tương đương

- [ ] Thêm seed dữ liệu mẫu có tiếng Việt có dấu chuẩn UTF-8.
- [ ] Rà lại toàn bộ text tiếng Việt trên UI và API.
- [ ] Thêm empty states, loading states và thông báo lỗi cơ bản.
- [ ] Xác nhận preview các loại tệp phổ biến hoạt động hợp lý.

## Task 10: Xác minh dự án

**Files:**
- Modify: `README.md`

- [ ] Chạy test backend.
- [ ] Chạy test frontend.
- [ ] Chạy build backend và frontend.
- [ ] Viết README hướng dẫn cài đặt, chạy, seed dữ liệu.
- [ ] Tổng hợp các giới hạn còn lại của MVP.
