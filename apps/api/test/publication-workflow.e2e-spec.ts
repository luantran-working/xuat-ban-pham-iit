import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureTestApp } from './test-app';

describe('Publication workflow (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let prisma: PrismaClient;
  const apiRoot = path.resolve(__dirname, '..');

  const uploadDir = path.resolve(apiRoot, '..', '..', 'storage', 'test');

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.UPLOAD_DIR = uploadDir;

    if (existsSync(uploadDir)) {
      rmSync(uploadDir, { recursive: true, force: true });
    }

    mkdirSync(uploadDir, { recursive: true });

    execSync(
      'npx prisma db push --skip-generate --schema ./prisma/schema.prisma',
      {
        cwd: apiRoot,
        stdio: 'ignore',
      },
    );

    prisma = new PrismaClient();
    await prisma.publicationHistory.deleteMany();
    await prisma.publicationFile.deleteMany();
    await prisma.publication.deleteMany();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await configureTestApp(app);

    const login = await request(app.getHttpServer()).post('/admin/login').send({
      username: 'admin',
      password: 'iit@123',
    });

    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }

    if (app) {
      await app.close();
    }
  });

  it('upload, phát hành, tạm ngưng và khóa nội dung đúng quy trình', async () => {
    const uniqueSuffix = Date.now();
    const title = `Kỷ yếu Công nghệ số ${uniqueSuffix}`;

    const uploadResponse = await request(app.getHttpServer())
      .post('/publications/upload')
      .field('title', title)
      .field('description', 'Bộ tài liệu minh họa quy trình xuất bản điện tử')
      .field('author', 'Phòng Nghiên cứu IIT')
      .field('publishYear', '2026')
      .field('copyrightExpiryDate', '2030-12-31')
      .attach('files', Buffer.from('%PDF-1.4 demo pdf content', 'utf8'), {
        filename: 'tai-lieu-demo.pdf',
        contentType: 'application/pdf',
      })
      .attach('files', Buffer.from('fake image bytes', 'utf8'), {
        filename: 'anh-bia.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);

    expect(uploadResponse.body.status).toBe('PENDING');
    expect(uploadResponse.body.history.at(-1)?.action).toBe('UPLOAD');
    expect(uploadResponse.body.files[0].previewUrl).toMatch(
      /\/content\/preview\.pdf$/,
    );

    await request(app.getHttpServer())
      .get('/publications')
      .query({ search: title })
      .expect(200)
      .expect(({ body }) => {
        expect(body.items).toHaveLength(0);
      });

    const publicationId = uploadResponse.body.id as string;

    await request(app.getHttpServer())
      .patch(`/admin/publications/${publicationId}/publish`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(400);

    await request(app.getHttpServer())
      .patch(`/admin/publications/${publicationId}/publish`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ note: 'Đủ điều kiện phát hành' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('PUBLISHED');
      });

    await request(app.getHttpServer())
      .get('/publications')
      .query({ search: title })
      .expect(200)
      .expect(({ body }) => {
        expect(body.items).toHaveLength(1);
        expect(body.items[0].status).toBe('PUBLISHED');
      });

    const detailResponse = await request(app.getHttpServer())
      .get(`/publications/${publicationId}`)
      .expect(200);

    expect(detailResponse.body.isLocked).toBe(false);
    expect(detailResponse.body.files).toHaveLength(2);

    const historyResponse = await request(app.getHttpServer())
      .get(`/admin/publications/${publicationId}/history`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(
      historyResponse.body.items.some(
        (item: { action: string }) => item.action === 'PUBLISH',
      ),
    ).toBe(true);

    await request(app.getHttpServer())
      .patch(`/admin/publications/${publicationId}/suspend`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ note: 'Hết hạn bản quyền' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('SUSPENDED');
      });

    await request(app.getHttpServer())
      .get('/publications')
      .query({ search: title })
      .expect(200)
      .expect(({ body }) => {
        expect(body.items).toHaveLength(1);
        expect(body.items[0].status).toBe('SUSPENDED');
      });

    await request(app.getHttpServer())
      .get(`/publications/${publicationId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.isLocked).toBe(true);
        expect(body.message).toBe('Nội dung không còn khả dụng');
      });
  });

  it('chuẩn hóa tên tệp Unicode bị lỗi và vẫn lưu file vật lý bằng tên ngẫu nhiên', async () => {
    const uniqueSuffix = Date.now();
    const title = `Kiểm thử Unicode ${uniqueSuffix}`;
    const expectedFilename =
      '2.9 Kết nối cuộc sống - Khám phá nghề nghiệp.docx';
    const mojibakeFilename = Buffer.from(expectedFilename, 'utf8').toString(
      'latin1',
    );

    const uploadResponse = await request(app.getHttpServer())
      .post('/publications/upload')
      .field('title', title)
      .field('description', 'Kiểm thử chuẩn hóa tên tệp Unicode khi upload')
      .field('author', 'Phòng Kiểm thử IIT')
      .field('publishYear', '2026')
      .field('copyrightExpiryDate', '2030-12-31')
      .attach('files', Buffer.from('demo file content', 'utf8'), {
        filename: mojibakeFilename,
        contentType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
      .expect(201);

    expect(uploadResponse.body.files).toHaveLength(1);
    expect(uploadResponse.body.files[0].originalName).toBe(expectedFilename);
    expect(uploadResponse.body.files[0].extension).toBe('docx');
    expect(uploadResponse.body.files[0].previewUrl).toMatch(
      /\/content\/preview\.docx$/,
    );

    const persistedPublication = await prisma.publication.findUniqueOrThrow({
      where: { id: uploadResponse.body.id },
      include: {
        files: true,
      },
    });

    expect(persistedPublication.files).toHaveLength(1);
    expect(persistedPublication.files[0].storedName).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.docx$/,
    );
    expect(persistedPublication.files[0].originalName).toBe(expectedFilename);
  });

  it('cho phép truy cập public theo link tệp để hỗ trợ preview trước khi phát hành', async () => {
    const uniqueSuffix = Date.now();
    const title = `Kiểm thử preview admin ${uniqueSuffix}`;

    const uploadResponse = await request(app.getHttpServer())
      .post('/publications/upload')
      .field('title', title)
      .field('description', 'Kiểm thử preview nội dung tệp phía admin')
      .field('author', 'Phòng Kiểm thử IIT')
      .field('publishYear', '2026')
      .field('copyrightExpiryDate', '2030-12-31')
      .attach(
        'files',
        Buffer.from('%PDF-1.4 pending preview content', 'utf8'),
        {
          filename: 'pending-preview.pdf',
          contentType: 'application/pdf',
        },
      )
      .expect(201);

    const publicationId = uploadResponse.body.id as string;
    const fileId = uploadResponse.body.files[0].id as string;

    await request(app.getHttpServer())
      .get(`/publications/${publicationId}/files/${fileId}/content`)
      .expect(200)
      .expect((response) => {
        expect(response.headers['content-type']).toContain('application/pdf');
      });

    await request(app.getHttpServer())
      .get(`/admin/publications/${publicationId}/files/${fileId}/content`)
      .expect(401);

    await request(app.getHttpServer())
      .get(`/admin/publications/${publicationId}/files/${fileId}/content`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.headers['content-type']).toContain('application/pdf');
      });
  });
});
