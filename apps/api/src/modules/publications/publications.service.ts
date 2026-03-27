import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { existsSync, rmSync } from 'node:fs';
import {
  Prisma,
  PublicationHistoryAction,
  PublicationStatus as PrismaPublicationStatus,
} from '@prisma/client';
import { extname, resolve } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import {
  ListAdminPublicationsDto,
  ListPublicationsDto,
} from './dto/list-publications.dto';
import { ReviewPublicationDto } from './dto/review-publication.dto';
import { UploadPublicationDto } from './dto/upload-publication.dto';
import {
  PublicationStatus,
  transitionPublicationStatus,
} from './publication-status';
import {
  getUploadDirectory,
  normalizeUploadedOriginalName,
} from './upload-storage';

const PUBLIC_ACTOR = 'Người dùng công khai';
const ADMIN_ACTOR = 'admin';

type UploadedFile = {
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
};

@Injectable()
export class PublicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadPublication(dto: UploadPublicationDto, files: UploadedFile[]) {
    if (!files.length) {
      throw new BadRequestException('Cần tải lên ít nhất một tệp.');
    }

    const publication = await this.prisma.publication.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        author: dto.author.trim(),
        publishYear: Number(dto.publishYear),
        copyrightExpiryDate: new Date(dto.copyrightExpiryDate),
        status: PrismaPublicationStatus.PENDING,
        files: {
          create: files.map((file) => {
            const normalizedOriginalName = normalizeUploadedOriginalName(
              file.originalname,
            );

            return {
              originalName: normalizedOriginalName,
              storedName: file.filename,
              mimeType: file.mimetype || 'application/octet-stream',
              extension: extname(normalizedOriginalName)
                .replace('.', '')
                .toLowerCase(),
              size: file.size,
              relativePath: this.normalizeRelativePath(file.path),
            };
          }),
        },
        histories: {
          create: [
            {
              action: PublicationHistoryAction.UPLOAD,
              actor: PUBLIC_ACTOR,
              note: 'Tải lên xuất bản phẩm mới và chờ duyệt.',
              nextStatus: PrismaPublicationStatus.PENDING,
            },
          ],
        },
      },
      include: {
        files: true,
        histories: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return this.mapPublicationDetail(publication, false);
  }

  async listPublications(query: ListPublicationsDto) {
    const where: Prisma.PublicationWhereInput = {
      status: {
        in: [
          PrismaPublicationStatus.PUBLISHED,
          PrismaPublicationStatus.SUSPENDED,
        ],
      },
    };

    if (query.search?.trim()) {
      where.OR = [
        { title: { contains: query.search.trim() } },
        { author: { contains: query.search.trim() } },
      ];
    }

    const items = await this.prisma.publication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        files: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return {
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        description: item.description,
        publishYear: item.publishYear,
        status: item.status,
        isLocked: item.status === PrismaPublicationStatus.SUSPENDED,
        fileCount: item.files.length,
        createdAt: item.createdAt,
      })),
    };
  }

  async getPublicPublicationDetail(id: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
      include: {
        files: {
          orderBy: { createdAt: 'asc' },
        },
        histories: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (
      !publication ||
      publication.status === PrismaPublicationStatus.PENDING
    ) {
      throw new NotFoundException('Không tìm thấy xuất bản phẩm.');
    }

    if (publication.status === PrismaPublicationStatus.SUSPENDED) {
      return {
        id: publication.id,
        title: publication.title,
        author: publication.author,
        description: publication.description,
        publishYear: publication.publishYear,
        status: publication.status,
        isLocked: true,
        message: 'Nội dung không còn khả dụng',
        files: [],
      };
    }

    return this.mapPublicationDetail(publication, false);
  }

  async getFileContent(publicationId: string, fileId: string) {
    return this.getPublicationFileContent(publicationId, fileId, true);
  }

  async getAdminFileContent(publicationId: string, fileId: string) {
    return this.getPublicationFileContent(publicationId, fileId, true);
  }

  private async getPublicationFileContent(
    publicationId: string,
    fileId: string,
    allowNonPublished: boolean,
  ) {
    const publication = await this.prisma.publication.findUnique({
      where: { id: publicationId },
      include: {
        files: true,
      },
    });

    if (!publication) {
      throw new NotFoundException('Không tìm thấy xuất bản phẩm.');
    }

    if (
      !allowNonPublished &&
      publication.status !== PrismaPublicationStatus.PUBLISHED
    ) {
      throw new ForbiddenException(
        'Tệp chỉ khả dụng khi xuất bản phẩm đã phát hành.',
      );
    }

    const file = publication.files.find((item) => item.id === fileId);

    if (!file) {
      throw new NotFoundException('Không tìm thấy tệp đính kèm.');
    }

    return {
      file,
      absolutePath: this.resolveStoredFileAbsolutePath(file.relativePath),
    };
  }

  async listAdminPublications(query: ListAdminPublicationsDto) {
    const where: Prisma.PublicationWhereInput = {};

    if (query.status) {
      where.status = query.status as PrismaPublicationStatus;
    }

    if (query.search?.trim()) {
      where.OR = [
        { title: { contains: query.search.trim() } },
        { author: { contains: query.search.trim() } },
      ];
    }

    const items = await this.prisma.publication.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        files: {
          orderBy: { createdAt: 'asc' },
        },
        histories: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return {
      items: items.map((item) => this.mapPublicationDetail(item, true)),
    };
  }

  async reviewPublication(
    id: string,
    nextStatus: PublicationStatus,
    dto: ReviewPublicationDto,
  ) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
    });

    if (!publication) {
      throw new NotFoundException('Không tìm thấy xuất bản phẩm.');
    }

    const validatedStatus = transitionPublicationStatus(
      publication.status as PublicationStatus,
      nextStatus,
    );

    const action =
      validatedStatus === PublicationStatus.PUBLISHED
        ? PublicationHistoryAction.PUBLISH
        : PublicationHistoryAction.SUSPEND;

    const updated = await this.prisma.publication.update({
      where: { id },
      data: {
        status: validatedStatus as PrismaPublicationStatus,
        histories: {
          create: [
            {
              action,
              actor: ADMIN_ACTOR,
              note: dto.note.trim(),
              previousStatus: publication.status,
              nextStatus: validatedStatus as PrismaPublicationStatus,
            },
          ],
        },
      },
      include: {
        files: true,
        histories: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return this.mapPublicationDetail(updated, true);
  }

  async getAdminHistory(id: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
    });

    if (!publication) {
      throw new NotFoundException('Không tìm thấy xuất bản phẩm.');
    }

    const items = await this.prisma.publicationHistory.findMany({
      where: { publicationId: id },
      orderBy: { createdAt: 'desc' },
    });

    return { items };
  }

  async deletePublication(id: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
      include: {
        files: true,
      },
    });

    if (!publication) {
      throw new NotFoundException('Không tìm thấy xuất bản phẩm.');
    }

    await this.prisma.publication.delete({
      where: { id },
    });

    for (const file of publication.files) {
      const absolutePath = this.resolveStoredFileAbsolutePath(
        file.relativePath,
      );
      if (existsSync(absolutePath)) {
        rmSync(absolutePath, { force: true });
      }
    }

    return { success: true };
  }

  async deletePublicationHistory(publicationId: string, historyId: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id: publicationId },
      select: { id: true },
    });

    if (!publication) {
      throw new NotFoundException('Không tìm thấy xuất bản phẩm.');
    }

    const history = await this.prisma.publicationHistory.findUnique({
      where: { id: historyId },
      select: { id: true, publicationId: true },
    });

    if (!history || history.publicationId !== publicationId) {
      throw new NotFoundException('Không tìm thấy bản ghi lịch sử.');
    }

    await this.prisma.publicationHistory.delete({
      where: { id: historyId },
    });

    return { success: true };
  }

  getUploadDirectory() {
    return getUploadDirectory();
  }

  private mapPublicationDetail(
    publication: {
      id: string;
      title: string;
      description: string;
      author: string;
      publishYear: number;
      copyrightExpiryDate: Date;
      status: PrismaPublicationStatus;
      createdAt: Date;
      updatedAt: Date;
      files: Array<{
        id: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        createdAt: Date;
      }>;
      histories: Array<{
        id: string;
        action: PublicationHistoryAction;
        actor: string;
        note: string;
        previousStatus: PrismaPublicationStatus | null;
        nextStatus: PrismaPublicationStatus | null;
        createdAt: Date;
      }>;
    },
    includeHistories: boolean,
  ) {
    return {
      id: publication.id,
      title: publication.title,
      description: publication.description,
      author: publication.author,
      publishYear: publication.publishYear,
      copyrightExpiryDate: publication.copyrightExpiryDate,
      status: publication.status,
      isLocked: false,
      createdAt: publication.createdAt,
      updatedAt: publication.updatedAt,
      files: publication.files.map((file) => ({
        ...this.buildPublicFileLinks(
          publication.id,
          file.id,
          file.originalName,
          file.extension,
        ),
        id: file.id,
        originalName: file.originalName,
        mimeType: file.mimeType,
        extension: file.extension,
        size: file.size,
        previewType: this.getPreviewType(file.mimeType),
        createdAt: file.createdAt,
      })),
      history: includeHistories
        ? publication.histories.map((item) => ({
            id: item.id,
            action: item.action,
            actor: item.actor,
            note: item.note,
            previousStatus: item.previousStatus,
            nextStatus: item.nextStatus,
            createdAt: item.createdAt,
          }))
        : publication.histories.map((item) => ({
            id: item.id,
            action: item.action,
            actor: item.actor,
            note: item.note,
            previousStatus: item.previousStatus,
            nextStatus: item.nextStatus,
            createdAt: item.createdAt,
          })),
    };
  }

  private getPreviewType(mimeType: string) {
    if (mimeType === 'application/pdf') {
      return 'pdf';
    }

    if (mimeType.startsWith('image/')) {
      return 'image';
    }

    if (mimeType.startsWith('video/')) {
      return 'video';
    }

    if (mimeType.startsWith('audio/')) {
      return 'audio';
    }

    return 'file';
  }

  private normalizeRelativePath(filePath: string) {
    const projectRoot = resolve(process.cwd(), '..', '..');
    return filePath.replace(`${projectRoot}\\`, '').replaceAll('\\', '/');
  }

  private resolveStoredFileAbsolutePath(relativePath: string) {
    const projectRoot = resolve(process.cwd(), '..', '..');
    return resolve(projectRoot, relativePath);
  }

  private buildPublicFileLinks(
    publicationId: string,
    fileId: string,
    originalName: string,
    extension: string,
  ) {
    const safeExtension = (extension || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
    const filename = this.buildViewerFilename(originalName, safeExtension);
    const basePath = `/publications/${publicationId}/files/${fileId}/content/${encodeURIComponent(filename)}`;

    return {
      previewUrl: basePath,
      downloadUrl: `${basePath}?download=1`,
    };
  }

  private buildViewerFilename(originalName: string, safeExtension: string) {
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const asciiBase = nameWithoutExt
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');

    const base = asciiBase || 'preview';
    return safeExtension ? `${base}.${safeExtension}` : `${base}.bin`;
  }
}
