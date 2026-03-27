import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Search, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicationCard } from "@/components/publication-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPublications } from "@/lib/api";
import type { PublicationStatus } from "@/types/publication";

const filters: Array<{ label: string; value: "ALL" | PublicationStatus }> = [
  { label: "Tất cả", value: "ALL" },
  { label: "Đã phát hành", value: "PUBLISHED" },
  { label: "Tạm ngưng", value: "SUSPENDED" },
];

export function PublicationsListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | PublicationStatus>("ALL");
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, error } = useQuery({
    queryKey: ["publications", deferredSearch],
    queryFn: () => fetchPublications(deferredSearch),
  });

  const items = useMemo(() => {
    if (!data?.items) return [];
    if (status === "ALL") return data.items;
    return data.items.filter((item) => item.status === status);
  }, [data?.items, status]);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="reveal">
          <div className="eyebrow">Dữ liệu số</div>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="section-title">
                Danh mục xuất bản phẩm điện tử phát hành công bố
              </h1>
              <p className="body-text mt-2 max-w-xl">
                Tìm kiếm và tra cứu các phát hành phẩm điện tử đã được đặc duyệt
                và phát hành trên hệ thống.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/upload">
                <Upload className="h-4 w-4" />
                Gửi phát hành phẩm mới
              </Link>
            </Button>
          </div>
        </div>

        <div className="reveal reveal-delay-1 mt-8 flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <Input
              className="pl-10"
              placeholder="Nhập tiêu đề hoặc tác giả để tra cứu..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                type="button"
                variant={status === filter.value ? "default" : "outline"}
                size="sm"
                className={status === filter.value ? "text-white" : undefined}
                onClick={() => setStatus(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="reveal reveal-delay-2 mt-8">
          {isLoading ? (
            <div className="rounded-[var(--radius)] border border-dashed border-[var(--border-strong)] p-12 text-center text-[var(--muted-foreground)]">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary-200)] border-t-[var(--accent)]" />
              Đang tải danh mục xuất bản phẩm điện tử phát hành...
            </div>
          ) : error ? (
            <div className="rounded-[var(--radius)] border border-rose-200 bg-rose-50 p-12 text-center text-rose-700">
              {(error as Error).message}
            </div>
          ) : items.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((publication) => (
                <div key={publication.id}>
                  <PublicationCard publication={publication} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius)] border border-dashed border-[var(--border-strong)] bg-[var(--primary-50)] p-12 text-center">
              <FileText className="mx-auto mb-3 h-10 w-10 text-[var(--primary-300)]" />
              <h3 className="font-heading text-lg font-semibold">
                Chưa có kết quả phù hợp
              </h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Thử tìm theo tiêu đề khác hoặc kết hợp bộ lọc trạng thái.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
