import { mkdirSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

export function getUploadDirectory() {
  const uploadDir =
    process.env.UPLOAD_DIR ??
    resolve(process.cwd(), '..', '..', 'storage', 'uploads');

  mkdirSync(uploadDir, { recursive: true });

  return uploadDir;
}

export function createStoredFilename(originalName: string) {
  return `${randomUUID()}${extname(originalName).toLowerCase()}`;
}

export function normalizeUploadedOriginalName(originalName: string) {
  const safeOriginalName = basename(originalName).trim();

  if (!safeOriginalName) {
    return 'uploaded-file';
  }

  // Some clients send UTF-8 bytes interpreted as latin1 by multipart parsing.
  if (!looksLikeMojibake(safeOriginalName)) {
    return safeOriginalName;
  }

  const decoded = Buffer.from(safeOriginalName, 'latin1').toString('utf8');

  return decoded.includes('\uFFFD') ? safeOriginalName : decoded;
}

function looksLikeMojibake(name: string) {
  return /Ã.|Â.|Ä.|Å.|Æ.|Ç.|È.|É.|Ê.|Ë.|Ì.|Í.|Î.|Ï.|Ð.|Ñ.|Ò.|Ó.|Ô.|Õ.|Ö.|×.|Ø.|Ù.|Ú.|Û.|Ü.|Ý.|Þ.|ß.|áº.|á»./.test(
    name,
  );
}
