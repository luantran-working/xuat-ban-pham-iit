import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'node:fs';
import type { Response } from 'express';
import { ListPublicationsDto } from './dto/list-publications.dto';
import { UploadPublicationDto } from './dto/upload-publication.dto';
import { PublicationsService } from './publications.service';
import {
  createStoredFilename,
  getUploadDirectory,
  normalizeUploadedOriginalName,
} from './upload-storage';

type UploadedFile = {
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
};

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          callback(null, getUploadDirectory());
        },
        filename: (_req, file, callback) => {
          const normalizedOriginalName = normalizeUploadedOriginalName(
            file.originalname,
          );
          file.originalname = normalizedOriginalName;
          callback(null, createStoredFilename(normalizedOriginalName));
        },
      }),
    }),
  )
  uploadPublication(
    @Body() dto: UploadPublicationDto,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        fileIsRequired: false,
      }),
    )
    files: UploadedFile[],
  ) {
    return this.publicationsService.uploadPublication(dto, files ?? []);
  }

  @Get()
  listPublications(@Query() query: ListPublicationsDto) {
    return this.publicationsService.listPublications(query);
  }

  @Get(':id')
  getPublicationDetail(@Param('id') id: string) {
    return this.publicationsService.getPublicPublicationDetail(id);
  }

  @Get(':id/files/:fileId/content')
  async getPublicationFile(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Query('download') download: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { file, absolutePath } =
      await this.publicationsService.getFileContent(id, fileId);

    response.setHeader('Content-Type', file.mimeType);
    response.setHeader(
      'Content-Disposition',
      `${download ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
    );

    return new StreamableFile(createReadStream(absolutePath));
  }
}
