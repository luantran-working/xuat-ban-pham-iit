import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { getUploadDirectory } from './upload-storage';

export type ChunkUploadManifest = {
  uploadId: string;
  metadata: {
    title: string;
    description: string;
    author: string;
    publishYear: number;
    copyrightExpiryDate: string;
  };
  files: Array<{
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    chunkSize: number;
    chunkCount: number;
  }>;
};

export function createChunkUploadManifest(input: {
  metadata: ChunkUploadManifest['metadata'];
  files: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    chunkSize: number;
    chunkCount: number;
  }>;
}) {
  const manifest: ChunkUploadManifest = {
    uploadId: randomUUID(),
    metadata: input.metadata,
    files: input.files.map((file) => ({
      id: randomUUID(),
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      chunkSize: file.chunkSize,
      chunkCount: file.chunkCount,
    })),
  };

  mkdirSync(getChunkSessionDirectory(manifest.uploadId), { recursive: true });
  writeFileSync(getChunkManifestPath(manifest.uploadId), JSON.stringify(manifest));

  return manifest;
}

export function readChunkUploadManifest(uploadId: string) {
  const manifestPath = getChunkManifestPath(uploadId);

  if (!existsSync(manifestPath)) {
    return null;
  }

  return JSON.parse(readFileSync(manifestPath, 'utf8')) as ChunkUploadManifest;
}

export function removeChunkUploadSession(uploadId: string) {
  rmSync(getChunkSessionDirectory(uploadId), { recursive: true, force: true });
}

export function getChunkFilePath(
  uploadId: string,
  fileId: string,
  chunkIndex: number,
) {
  const directory = getChunkFileDirectory(uploadId, fileId);
  mkdirSync(directory, { recursive: true });
  return resolve(directory, `${chunkIndex}.part`);
}

export function getChunkFileSize(
  uploadId: string,
  fileId: string,
  chunkIndex: number,
) {
  const filePath = getChunkFilePath(uploadId, fileId, chunkIndex);

  if (!existsSync(filePath)) {
    return null;
  }

  return statSync(filePath).size;
}

export function assembleChunkedFile(params: {
  uploadId: string;
  fileId: string;
  chunkCount: number;
  destinationPath: string;
}) {
  writeFileSync(params.destinationPath, Buffer.alloc(0));

  for (let index = 0; index < params.chunkCount; index += 1) {
    const chunkPath = getChunkFilePath(params.uploadId, params.fileId, index);
    appendFileSync(params.destinationPath, readFileSync(chunkPath));
  }
}

function getChunkManifestPath(uploadId: string) {
  return resolve(getChunkSessionDirectory(uploadId), 'manifest.json');
}

function getChunkFileDirectory(uploadId: string, fileId: string) {
  return resolve(getChunkSessionDirectory(uploadId), 'files', fileId);
}

function getChunkSessionDirectory(uploadId: string) {
  return resolve(getChunkRootDirectory(), uploadId);
}

function getChunkRootDirectory() {
  return resolve(getUploadDirectory(), '_chunk-sessions');
}
