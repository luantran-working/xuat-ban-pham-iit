import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureTestApp } from './test-app';

describe('Admin auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await configureTestApp(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('đăng nhập thành công với tài khoản quản trị cố định', async () => {
    const response = await request(app.getHttpServer())
      .post('/admin/login')
      .send({
        username: 'admin',
        password: 'iit@123',
      })
      .expect(201);

    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.username).toBe('admin');
  });

  it('từ chối đăng nhập sai mật khẩu', async () => {
    await request(app.getHttpServer())
      .post('/admin/login')
      .send({
        username: 'admin',
        password: 'sai-mat-khau',
      })
      .expect(401);
  });
});
