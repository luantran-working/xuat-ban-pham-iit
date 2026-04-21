import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicationListItem } from "@/types/publication";
import { ArrowUpRight, FileText, LockKeyhole, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export function PublicationCard({
  publication,
}: {
  publication: PublicationListItem;
}) {
  return (
    <Link to={`/publications/${publication.id}`} className="block h-full group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:border-[var(--accent)] cursor-pointer">
        {/* Card Header Accent */}
        <div className="h-1 bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-600)] transition-all duration-300 group-hover:h-1.5" />

        <CardHeader className="space-y-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <StatusBadge status={publication.status} />
            {/* <div className="text-xs text-[var(--muted-foreground)]">
              {formatDate(publication.createdAt)}
            </div> */}
          </div>
          <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
            {publication.title}
          </CardTitle>
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {publication.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-2 rounded-[var(--radius-sm)] bg-[var(--primary-50)] p-4 text-sm text-[var(--muted-foreground)]">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-[var(--accent)]" />
              <span>{publication.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--accent)]" />
              <span>{publication.fileCount} tệp đính kèm</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] px-4 py-3 text-sm">
            {/* <span className="text-[var(--muted-foreground)]">
              Năm {publication.publishYear}
            </span> */}
            {publication.isLocked ? (
              <span className="flex items-center gap-1.5 font-medium text-rose-600">
                <LockKeyhole className="h-3.5 w-3.5" />
                Đã khóa
              </span>
            ) : (
              <span className="flex items-center gap-1 font-medium text-[var(--accent)] group-hover:gap-2 transition-all">
                Xem chi tiết
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
