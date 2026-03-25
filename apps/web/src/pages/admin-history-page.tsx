import { useDeferredValue, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { getAdminToken } from "@/lib/auth";
import { deleteAdminHistoryItem, fetchAdminPublications } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import type { PublicationHistoryItem } from "@/types/publication";

const actionLabels: Record<PublicationHistoryItem["action"] | "ALL", string> = {
  ALL: "Tất cả",
  UPLOAD: "Tải lên",
  UPDATE: "Cập nhật",
  PUBLISH: "Phát hành",
  SUSPEND: "Tạm ngưng",
};

export function AdminHistoryPage() {
  const queryClient = useQueryClient();
  const token = getAdminToken() ?? "";
  const [search, setSearch] = useState("");
  const [action, setAction] = useState<
    PublicationHistoryItem["action"] | "ALL"
  >("ALL");
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-history-publications", deferredSearch],
    queryFn: () => fetchAdminPublications(token, deferredSearch, "ALL"),
  });

  const deleteHistoryMutation = useMutation({
    mutationFn: async ({
      publicationId,
      historyId,
    }: {
      publicationId: string;
      historyId: string;
    }) => deleteAdminHistoryItem(token, publicationId, historyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-history-publications"],
      });
    },
  });

  const historyItems = useMemo(() => {
    const items =
      data?.items.flatMap((publication) =>
        publication.history.map((item) => ({
          ...item,
          publicationId: publication.id,
          publicationTitle: publication.title,
          publicationAuthor: publication.author,
          publicationStatus: publication.status,
        })),
      ) ?? [];

    const filtered =
      action === "ALL" ? items : items.filter((item) => item.action === action);

    return filtered.sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    );
  }, [action, data?.items]);

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle>Lịch sử ghi nhận</CardTitle>
              <CardDescription>
                Theo dõi đầy đủ quá trình tải lên, phát hành, cập nhật và tạm
                ngưng của từng xuất bản phẩm.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <Input
                className="pl-10"
                placeholder="Tìm theo tiêu đề hoặc tác giả..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap gap-2">
            {Object.entries(actionLabels).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={action === value ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setAction(value as PublicationHistoryItem["action"] | "ALL")
                }
              >
                {label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="rounded-sm border border-dashed border-[var(--border-strong)] p-8 text-center text-[var(--muted-foreground)]">
              Đang tải lịch sử thao tác...
            </div>
          ) : error ? (
            <div className="rounded-sm border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
              {(error as Error).message}
            </div>
          ) : historyItems.length ? (
            <div className="space-y-4">
              {historyItems.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-sm border border-[var(--border)] bg-white/80 p-5 md:grid-cols-[1.2fr_0.6fr]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="font-heading text-lg font-semibold">
                        {item.publicationTitle}
                      </div>
                      <StatusBadge status={item.publicationStatus} />
                    </div>
                    <div className="mt-2 text-sm text-[var(--muted-foreground)]">
                      Tác giả/đơn vị gửi: {item.publicationAuthor}
                    </div>
                    <div className="mt-4 text-sm leading-7">{item.note}</div>
                  </div>
                  <div className="grid gap-3 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted-foreground)] md:border-l md:border-t-0 md:pl-5 md:pt-0">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.2em]">
                        Hành động
                      </div>
                      <div className="mt-1 font-medium text-[var(--foreground)]">
                        {actionLabels[item.action]}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.2em]">
                        Người thực hiện
                      </div>
                      <div className="mt-1 font-medium text-[var(--foreground)]">
                        {item.actor}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.2em]">
                        Thời điểm
                      </div>
                      <div className="mt-1 text-[var(--foreground)]">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={deleteHistoryMutation.isPending}
                      onClick={async () => {
                        const shouldDelete = window.confirm(
                          "Bạn có chắc muốn xóa bản ghi lịch sử này?",
                        );
                        if (!shouldDelete) return;

                        await deleteHistoryMutation.mutateAsync({
                          publicationId: item.publicationId,
                          historyId: item.id,
                        });
                      }}
                    >
                      Xóa lịch sử
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-dashed border-[var(--border-strong)] p-8 text-center text-[var(--muted-foreground)]">
              Chưa có bản ghi lịch sử phù hợp với điều kiện lọc hiện tại.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
