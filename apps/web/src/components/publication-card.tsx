import { Link } from 'react-router-dom';
import { FileText, LockKeyhole, UserRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { formatDate } from '@/lib/utils';
import type { PublicationListItem } from '@/types/publication';

export function PublicationCard({
  publication,
}: {
  publication: PublicationListItem;
}) {
  return (
    <Link to={`/publications/${publication.id}`} className="block h-full">
      <Card className="group h-full overflow-hidden border-[var(--border)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_22px_60px_rgba(30,92,186,0.12)]">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <StatusBadge status={publication.status} />
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {formatDate(publication.createdAt)}
            </div>
          </div>
          <CardTitle className="text-2xl leading-tight">{publication.title}</CardTitle>
          <p className="line-clamp-2 text-sm leading-7 text-[var(--muted-foreground)]">
            {publication.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 rounded-sm border border-[var(--border)] bg-[var(--card-soft)] p-4 text-sm text-[var(--muted-foreground)]">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              <span>{publication.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{publication.fileCount} tệp đính kèm</span>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-sm border border-dashed border-[var(--border-strong)] px-4 py-3 text-sm">
            <span>Năm xuất bản {publication.publishYear}</span>
            {publication.isLocked ? (
              <span className="flex items-center gap-2 font-medium text-rose-700">
                <LockKeyhole className="h-4 w-4" />
                Nội dung không còn khả dụng
              </span>
            ) : (
              <span className="font-medium text-[var(--accent)]">Xem chi tiết</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
