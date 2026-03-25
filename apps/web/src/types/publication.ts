export type PublicationStatus = 'PENDING' | 'PUBLISHED' | 'SUSPENDED';

export type PublicationListItem = {
  id: string;
  title: string;
  author: string;
  description: string;
  publishYear: number;
  status: PublicationStatus;
  isLocked: boolean;
  fileCount: number;
  createdAt: string;
};

export type PublicationFileItem = {
  id: string;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
  previewType: 'pdf' | 'image' | 'video' | 'audio' | 'file';
  previewUrl: string;
  downloadUrl: string;
  createdAt: string;
};

export type PublicationHistoryItem = {
  id: string;
  action: 'UPLOAD' | 'UPDATE' | 'PUBLISH' | 'SUSPEND';
  actor: string;
  note: string;
  previousStatus: PublicationStatus | null;
  nextStatus: PublicationStatus | null;
  createdAt: string;
};

export type PublicationDetail = {
  id: string;
  title: string;
  description: string;
  author: string;
  publishYear: number;
  copyrightExpiryDate?: string;
  status: PublicationStatus;
  isLocked: boolean;
  message?: string;
  files: PublicationFileItem[];
  history?: PublicationHistoryItem[];
  createdAt?: string;
  updatedAt?: string;
};
