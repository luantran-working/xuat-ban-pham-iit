import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import type { Request, Response } from 'express';
import { CompleteChunkUploadDto } from './dto/complete-chunk-upload.dto';
import { InitChunkUploadDto } from './dto/init-chunk-upload.dto';
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

const MAX_UPLOAD_FILE_SIZE_BYTES = 10 * 1024 * 1024 * 1024; // 10GB

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post('upload/init')
  initChunkUpload(@Body() dto: InitChunkUploadDto) {
    return this.publicationsService.initChunkUpload(dto);
  }

  @Post('upload/:uploadId/files/:fileId/chunks/:chunkIndex')
  async uploadChunk(
    @Param('uploadId') uploadId: string,
    @Param('fileId') fileId: string,
    @Param('chunkIndex', ParseIntPipe) chunkIndex: number,
    @Req() request: Request,
  ) {
    const target = this.publicationsService.prepareChunkUpload(
      uploadId,
      fileId,
      chunkIndex,
    );
    const contentLength = Number(request.headers['content-length'] ?? 0);

    if (!Number.isFinite(contentLength) || contentLength <= 0) {
      throw new BadRequestException('Chunk tải lên không hợp lệ.');
    }

    await pipeline(request, createWriteStream(target.path));

    return this.publicationsService.confirmChunkUpload(
      uploadId,
      fileId,
      chunkIndex,
      contentLength,
    );
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      limits: {
        fileSize: MAX_UPLOAD_FILE_SIZE_BYTES,
        fieldSize: 100 * 1024 * 1024, // 100MB for metadata fields
        fields: 100, // up to 100 metadata fields
        parts: 200, // up to 200 total parts (fields + files)
      },
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

  @Post('upload/:uploadId/complete')
  completeChunkUpload(
    @Param('uploadId') uploadId: string,
    @Body() _dto: CompleteChunkUploadDto,
  ) {
    return this.publicationsService.completeChunkUpload(uploadId);
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
    return this.streamPublicationFile(id, fileId, download, response);
  }

  @Get(':id/files/:fileId/content/:filename')
  async getPublicationFileWithName(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Param('filename') _filename: string,
    @Query('download') download: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.streamPublicationFile(id, fileId, download, response);
  }

  private async streamPublicationFile(
    id: string,
    fileId: string,
    download: string | undefined,
    response: Response,
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
