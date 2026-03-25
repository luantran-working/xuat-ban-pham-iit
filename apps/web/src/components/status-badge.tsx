import type { PublicationStatus } from '@/types/publication';
import { Badge } from '@/components/ui/badge';

const statusMap: Record<
  PublicationStatus,
  { label: string; variant: 'pending' | 'published' | 'suspended' }
> = {
  PENDING: { label: 'Đang chờ duyệt', variant: 'pending' },
  PUBLISHED: { label: 'Đã phát hành', variant: 'published' },
  SUSPENDED: { label: 'Tạm ngưng', variant: 'suspended' },
};

export function StatusBadge({ status }: { status: PublicationStatus }) {
  const item = statusMap[status];
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
