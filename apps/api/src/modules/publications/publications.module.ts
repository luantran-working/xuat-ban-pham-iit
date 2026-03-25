import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminPublicationsController } from './admin-publications.controller';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';

@Module({
  imports: [AuthModule],
  controllers: [PublicationsController, AdminPublicationsController],
  providers: [PublicationsService],
  exports: [PublicationsService],
})
export class PublicationsModule {}
