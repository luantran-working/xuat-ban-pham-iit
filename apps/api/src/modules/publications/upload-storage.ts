import { mkdirSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

export function getUploadDirectory() {
  const uploadDir =
    process.env.UPLOAD_DIR ?? resolve(process.cwd(), '..', '..', 'storage', 'uploads');

  mkdirSync(uploadDir, { recursive: true });

  return uploadDir;
}

export function createStoredFilename(originalName: string) {
  return `${randomUUID()}${extname(originalName).toLowerCase()}`;
}
