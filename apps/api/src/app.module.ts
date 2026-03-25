import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PublicationsModule } from './modules/publications/publications.module';

@Module({
  imports: [PrismaModule, AuthModule, PublicationsModule],
})
export class AppModule {}
