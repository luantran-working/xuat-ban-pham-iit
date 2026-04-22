import type { PublicationDetail } from '@/types/publication';

const DEFAULT_CHUNK_SIZE_BYTES = 10 * 1024 * 1024;

type ChunkDescriptor = {
  index: number;
  blob: Blob;
  size: number;
};

type ChunkPlan = {
  chunkSize: number;
  chunks: ChunkDescriptor[];
};

type UploadInitFile = {
  id: string;
  originalName: string;
  chunkCount: number;
  chunkSize: number;
  size: number;
};

type UploadInitResponse = {
  uploadId: string;
  files: UploadInitFile[];
};

type UploadMetadata = {
  title: string;
  description: string;
  author: string;
  publishYear: string;
  copyrightExpiryDate: string;
};

type UploadOptions = {
  apiBaseUrl: string;
  files: File[];
  metadata: UploadMetadata;
  onProgress?: (progress: { uploadedBytes: number; totalBytes: number }) => void;
};

export function buildChunkPlan(
  file: File,
  chunkSize = DEFAULT_CHUNK_SIZE_BYTES,
): ChunkPlan {
  const chunks: ChunkDescriptor[] = [];

  for (let start = 0, index = 0; start < file.size; start += chunkSize, index += 1) {
    const blob = file.slice(start, Math.min(start + chunkSize, file.size));
    chunks.push({ index, blob, size: blob.size });
  }

  return {
    chunkSize,
    chunks,
  };
}

export async function uploadPublicationInChunks(
  options: UploadOptions,
): Promise<PublicationDetail> {
  if (!options.files.length) {
    throw new Error('Vui lòng chọn ít nhất một tệp đính kèm.');
  }

  const filePlans = options.files.map((file) => ({
    file,
    plan: buildChunkPlan(file),
  }));
  const totalBytes = filePlans.reduce((sum, item) => sum + item.file.size, 0);
  let uploadedBytes = 0;

  const initResponse = await fetch(`${options.apiBaseUrl}/publications/upload/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...options.metadata,
      publishYear: Number(options.metadata.publishYear),
      files: filePlans.map(({ file, plan }) => ({
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        chunkSize: plan.chunkSize,
        chunkCount: plan.chunks.length,
      })),
    }),
  });

  const initBody = await parseJson<UploadInitResponse>(initResponse);

  for (let fileIndex = 0; fileIndex < filePlans.length; fileIndex += 1) {
    const { plan } = filePlans[fileIndex];
    const targetFile = initBody.files[fileIndex];

    for (const chunk of plan.chunks) {
      const chunkResponse = await fetch(
        `${options.apiBaseUrl}/publications/upload/${initBody.uploadId}/files/${targetFile.id}/chunks/${chunk.index}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          body: chunk.blob,
        },
      );

      if (!chunkResponse.ok) {
        await ensureOk(chunkResponse);
      }

      uploadedBytes += chunk.size;
      options.onProgress?.({ uploadedBytes, totalBytes });
    }
  }

  const completeResponse = await fetch(
    `${options.apiBaseUrl}/publications/upload/${initBody.uploadId}/complete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    },
  );

  return parseJson<PublicationDetail>(completeResponse);
}

async function ensureOk(response: Response) {
  if (response.ok) {
    return;
  }

  const errorBody = await response
    .json()
    .catch(() => ({ message: 'Đã có lỗi xảy ra.' }));

  throw new Error(errorBody.message ?? 'Đã có lỗi xảy ra.');
}

async function parseJson<T>(response: Response): Promise<T> {
  await ensureOk(response);
  return response.json() as Promise<T>;
}
