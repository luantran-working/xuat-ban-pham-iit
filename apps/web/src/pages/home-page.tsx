import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Search, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPublications } from "@/lib/api";
import { PublicationCard } from "@/components/publication-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PublicationStatus } from "@/types/publication";

const filters: Array<{ label: string; value: "ALL" | PublicationStatus }> = [
  { label: "Tất cả", value: "ALL" },
  { label: "Đã phát hành", value: "PUBLISHED" },
  { label: "Tạm ngưng", value: "SUSPENDED" },
];

export function HomePage() {
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

  const stats = useMemo(() => {
    const source = data?.items ?? [];
    return {
      total: source.length,
      published: source.filter((item) => item.status === "PUBLISHED").length,
      suspended: source.filter((item) => item.status === "SUSPENDED").length,
    };
  }, [data?.items]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <section className="glass-panel reveal overflow-hidden rounded-sm p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-5">
            <div className="eyebrow">Thư viện số công khai</div>
            <div className="display-title font-heading font-semibold">
              Danh sách xuất bản phẩm điện tử đã công bố
            </div>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">
              Tra cứu nhanh theo tiêu đề hoặc tác giả, xem trực tiếp các định
              dạng phổ biến và theo dõi rõ trạng thái phát hành của từng xuất
              bản phẩm trong cùng một không gian lưu hành tập trung.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                label="Tổng bản ghi công khai"
                value={String(stats.total)}
              />
              <MetricCard
                label="Đã phát hành"
                value={String(stats.published)}
              />
              <MetricCard label="Tạm ngưng" value={String(stats.suspended)} />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-sm border border-[var(--border)] bg-white/86 p-5">
              <div className="flex items-start gap-3">
                <div>
                  <div className="font-heading text-sm font-semibold">
                    Quy trình công bố minh bạch
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                    Chỉ những xuất bản phẩm đã phát hành hoặc tạm ngưng mới xuất
                    hiện tại danh mục công khai. Bản chờ duyệt luôn được tách
                    khỏi giao diện người dùng phổ thông.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-[var(--border)] bg-white/86 p-5">
              <div className="flex items-start gap-3">
                <div>
                  <div className="font-heading text-sm font-semibold">
                    Hỗ trợ nhiều loại tệp
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                    PDF, hình ảnh, âm thanh, video và các tài liệu phổ biến khác
                    đều có thể được tiếp nhận; những loại hỗ trợ preview sẽ hiển
                    thị trực tiếp trên website.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="text-white [&_svg]:text-white">
                <Link to="/upload">
                  <Upload className="h-4 w-4" />
                  <p className="text-white">Gửi xuất bản phẩm mới</p>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/gioi-thieu">
                  Tìm hiểu hệ thống
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal reveal-delay-1 mt-8 rounded-sm border border-white/70 bg-white/72 p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] items-center justify-center">
          <div className="grid gap-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <Input
                className="pl-10 max-w-[420px]"
                placeholder="Nhập tiêu đề hoặc tác giả để tra cứu..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                type="button"
                variant={status === filter.value ? "default" : "outline"}
                size="sm"
                className={
                  status === filter.value
                    ? "text-white [&_svg]:text-white"
                    : undefined
                }
                onClick={() => setStatus(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal reveal-delay-2 mt-8">
        {isLoading ? (
          <div className="rounded-sm border border-dashed border-[var(--border-strong)] p-10 text-center text-[var(--muted-foreground)]">
            Đang tải danh sách xuất bản phẩm...
          </div>
        ) : error ? (
          <div className="rounded-sm border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">
            {(error as Error).message}
          </div>
        ) : items.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((publication, index) => (
              <div
                key={publication.id}
                className={index < 3 ? "reveal reveal-delay-3" : ""}
              >
                <PublicationCard publication={publication} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-[var(--border-strong)] bg-white/60 p-10 text-center">
            <h2 className="section-title font-heading font-semibold">
              Chưa có kết quả phù hợp
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Hãy thử tìm theo tiêu đề khác hoặc tên tác giả, đơn vị gửi và kết
              hợp bộ lọc trạng thái để thu hẹp phạm vi hiển thị.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="hover-lift rounded-sm border border-[var(--border)] bg-white/82 p-4">
      <div className="metric-value">{value}</div>
      <div className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
        {label}
      </div>
    </div>
  );
}
