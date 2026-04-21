import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Increase body-parser limits to match Multer fileSize limit
  app.use(json({ limit: '10gb' }));
  app.use(urlencoded({ extended: true, limit: '10gb' }));

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  
  // Set server timeout to 1 hour for large uploads
  app.getHttpServer().setTimeout(3600000);
}
bootstrap();
