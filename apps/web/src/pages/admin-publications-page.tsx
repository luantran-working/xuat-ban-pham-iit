import { useDeferredValue, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { getAdminToken } from "@/lib/auth";
import {
  deleteAdminPublication,
  fetchAdminPublications,
  reviewPublication,
} from "@/lib/api";
import { PublicationPreviewDialog } from "@/components/admin/publication-preview-dialog";
import { ReviewDialog } from "@/components/admin/review-dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PublicationStatus } from "@/types/publication";

type DialogState = {
  publicationId: string;
  action: "publish" | "suspend";
} | null;

export function AdminPublicationsPage() {
  const queryClient = useQueryClient();
  const token = getAdminToken() ?? "";
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PublicationStatus | "ALL">("ALL");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [previewPublicationId, setPreviewPublicationId] = useState<
    string | null
  >(null);
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-publications", deferredSearch, status],
    queryFn: () => fetchAdminPublications(token, deferredSearch, status),
  });

  const previewPublication =
    data?.items.find((item) => item.id === previewPublicationId) ?? null;

  const reviewMutation = useMutation({
    mutationFn: async ({
      publicationId,
      action,
      note,
    }: {
      publicationId: string;
      action: "publish" | "suspend";
      note: string;
    }) => reviewPublication(token, publicationId, action, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
      setDialog(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (publicationId: string) =>
      deleteAdminPublication(token, publicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-publications"] });
    },
  });

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle>Tìm kiếm bản phẩm điện tử phát hành</CardTitle>
              <CardDescription>
                Tìm kiếm theo tiêu đề hoặc tác giả, sau đó thao tác phát hành
                hoặc gỡ bỏ mềm với ghi chú bắt buộc.
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
          <Tabs
            value={status}
            onValueChange={(value) =>
              setStatus(value as PublicationStatus | "ALL")
            }
          >
            <TabsList>
              <TabsTrigger value="ALL">Tất cả</TabsTrigger>
              <TabsTrigger value="PENDING">Chờ duyệt</TabsTrigger>
              <TabsTrigger value="PUBLISHED">Đã phát hành</TabsTrigger>
              <TabsTrigger value="SUSPENDED">Tạm ngưng</TabsTrigger>
            </TabsList>
            <TabsContent value={status} className="mt-6">
              {isLoading ? (
                <div className="rounded-sm border border-dashed border-[var(--border-strong)] p-8 text-center text-[var(--muted-foreground)]">
                  Đang tải dữ liệu quản trị...
                </div>
              ) : error ? (
                <div className="rounded-sm border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
                  {(error as Error).message}
                </div>
              ) : (
                <div className="overflow-hidden rounded-sm border border-[var(--border)] bg-white/70">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Tác giả</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Năm</TableHead>
                        <TableHead>Tệp</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="font-medium">{item.title}</div>
                            <div className="mt-1 line-clamp-2 text-xs text-[var(--muted-foreground)]">
                              {item.description}
                            </div>
                          </TableCell>
                          <TableCell>{item.author}</TableCell>
                          <TableCell>
                            <StatusBadge status={item.status} />
                          </TableCell>
                          <TableCell>{item.publishYear}</TableCell>
                          <TableCell>{item.files.length}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setPreviewPublicationId(item.id)}
                              >
                                Xem preview
                              </Button>
                              {item.status !== "PUBLISHED" ? (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    setDialog({
                                      publicationId: item.id,
                                      action: "publish",
                                    })
                                  }
                                >
                                  Phát hành
                                </Button>
                              ) : null}
                              {item.status !== "SUSPENDED" ? (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    setDialog({
                                      publicationId: item.id,
                                      action: "suspend",
                                    })
                                  }
                                >
                                  Gỡ bỏ
                                </Button>
                              ) : null}
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={deleteMutation.isPending}
                                onClick={async () => {
                                  const shouldDelete = window.confirm(
                                    "Bạn có chắc muốn xóa hẳn bản ghi phát hành phẩm này?",
                                  );
                                  if (!shouldDelete) return;
                                  await deleteMutation.mutateAsync(item.id);
                                }}
                              >
                                Xóa
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {dialog ? (
        <ReviewDialog
          action={dialog.action}
          open
          onOpenChange={(open) => {
            if (!open) setDialog(null);
          }}
          onConfirm={async (note) => {
            await reviewMutation.mutateAsync({
              publicationId: dialog.publicationId,
              action: dialog.action,
              note,
            });
          }}
        />
      ) : null}

      <PublicationPreviewDialog
        open={Boolean(previewPublicationId && previewPublication)}
        onOpenChange={(open) => {
          if (!open) setPreviewPublicationId(null);
        }}
        publication={previewPublication}
      />
    </div>
  );
}
