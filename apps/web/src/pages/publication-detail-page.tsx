import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react';
import { fetchPublicationDetail } from '@/lib/api';
import { FilePreview } from '@/components/file-preview';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

export function PublicationDetailPage() {
  const params = useParams();
  const publicationId = params.id ?? '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['publication-detail', publicationId],
    queryFn: () => fetchPublicationDetail(publicationId),
    enabled: Boolean(publicationId),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh mục
        </Link>
      </Button>

      {isLoading ? (
        <div className="rounded-sm border border-dashed border-[var(--border-strong)] p-10 text-center">
          Đang tải chi tiết phát hành phẩm...
        </div>
      ) : error ? (
        <div className="rounded-sm border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">
          {(error as Error).message}
        </div>
      ) : data ? (
        <div className="space-y-8">
          <Card>
            <CardContent className="grid gap-6 p-8 md:grid-cols-[1.3fr_0.8fr]">
              <div>
                <StatusBadge status={data.status} />
                <h1 className="mt-5 font-heading text-4xl leading-tight md:text-5xl">
                  {data.title}
                </h1>
                <p className="mt-5 text-base leading-8 text-[var(--muted-foreground)]">
                  {data.description}
                </p>
              </div>
              <div className="rounded-sm border border-[var(--border)] bg-[var(--card-soft)] p-5">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <UserRound className="h-4 w-4 text-[var(--accent)]" />
                    <span>{data.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-[var(--accent)]" />
                    <span>Năm phát hành {data.publishYear}</span>
                  </div>
                  {data.copyrightExpiryDate ? (
                    <div className="text-[var(--muted-foreground)]">
                      Hết hạn bản quyền: {formatDate(data.copyrightExpiryDate)}
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          {data.isLocked ? (
            <Card className="border-rose-200 bg-rose-50">
              <CardContent className="p-8">
                <h2 className="font-heading text-3xl">Nội dung không còn khả dụng</h2>
                <p className="mt-4 text-[var(--muted-foreground)]">
                  Phát hành phẩm này hiện đang ở trạng thái tạm ngưng nên hệ thống không cho phép
                  xem hoặc tải nội dung.
                </p>
              </CardContent>
            </Card>
          ) : (
            <section className="space-y-6">
              <div>
                <h2 className="font-heading text-3xl">Preview tệp đính kèm</h2>
                <p className="mt-2 text-[var(--muted-foreground)]">
                  Hệ thống tự động hiển thị preview cho PDF, hình ảnh, video, audio và tạo liên
                  kết tải với các loại tệp còn lại.
                </p>
              </div>
              <div className="grid gap-6">
                {data.files.map((file) => (
                  <FilePreview key={file.id} file={file} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : null}
    </div>
  );
}
