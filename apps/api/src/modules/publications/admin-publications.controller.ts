import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { ListAdminPublicationsDto } from './dto/list-publications.dto';
import { ReviewPublicationDto } from './dto/review-publication.dto';
import { PublicationsService } from './publications.service';
import { PublicationStatus } from './publication-status';

@UseGuards(AdminAuthGuard)
@Controller('admin/publications')
export class AdminPublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  listAdminPublications(@Query() query: ListAdminPublicationsDto) {
    return this.publicationsService.listAdminPublications(query);
  }

  @Get(':id/history')
  getAdminHistory(@Param('id') id: string) {
    return this.publicationsService.getAdminHistory(id);
  }

  @Patch(':id/publish')
  publishPublication(@Param('id') id: string, @Body() dto: ReviewPublicationDto) {
    return this.publicationsService.reviewPublication(
      id,
      PublicationStatus.PUBLISHED,
      dto,
    );
  }

  @Patch(':id/suspend')
  suspendPublication(@Param('id') id: string, @Body() dto: ReviewPublicationDto) {
    return this.publicationsService.reviewPublication(
      id,
      PublicationStatus.SUSPENDED,
      dto,
    );
  }
}
