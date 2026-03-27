import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { createReadStream } from 'node:fs';
import type { Response } from 'express';
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

  @Get(':id/files/:fileId/content')
  async getAdminPublicationFile(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Query('download') download: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { file, absolutePath } =
      await this.publicationsService.getAdminFileContent(id, fileId);

    response.setHeader('Content-Type', file.mimeType);
    response.setHeader(
      'Content-Disposition',
      `${download ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
    );

    return new StreamableFile(createReadStream(absolutePath));
  }

  @Delete(':id')
  deletePublication(@Param('id') id: string) {
    return this.publicationsService.deletePublication(id);
  }

  @Delete(':id/history/:historyId')
  deletePublicationHistory(
    @Param('id') id: string,
    @Param('historyId') historyId: string,
  ) {
    return this.publicationsService.deletePublicationHistory(id, historyId);
  }

  @Patch(':id/publish')
  publishPublication(
    @Param('id') id: string,
    @Body() dto: ReviewPublicationDto,
  ) {
    return this.publicationsService.reviewPublication(
      id,
      PublicationStatus.PUBLISHED,
      dto,
    );
  }

  @Patch(':id/suspend')
  suspendPublication(
    @Param('id') id: string,
    @Body() dto: ReviewPublicationDto,
  ) {
    return this.publicationsService.reviewPublication(
      id,
      PublicationStatus.SUSPENDED,
      dto,
    );
  }
}
