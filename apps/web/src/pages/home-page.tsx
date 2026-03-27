import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpenCheck,
  ChevronRight,
  Clock,
  FileCheck2,
  FileText,
  Globe,
  Lock,
  Search,
  Shield,
  Upload,
  Users,
  Zap,
} from "lucide-react";
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

const features = [
  {
    icon: FileCheck2,
    title: "Đọc duyệt chặt chẽ",
    description:
      "Mọi xuất bản phẩm điện tử đều trải qua quy trình rà soát, xác nhận bản quyền trước khi được công bố.",
  },
  {
    icon: Globe,
    title: "Công bố công khai",
    description:
      "Nội dung phát hành xuất bản phẩm điện tử được hiển thị trên dữ liệu số, phục vụ tra cứu và khai thác thuận tiện.",
  },
  {
    icon: Shield,
    title: "Bảo mật thông tin",
    description:
      "Xác thực người dùng, phân quyền rõ ràng, lưu vết mọi hành động trong hệ thống.",
  },
  {
    icon: Zap,
    title: "Preview trực tuyến",
    description:
      "Xem trực tiếp PDF, hình ảnh, audio, video trên trình duyệt mà không cần tải về máy.",
  },
  {
    icon: Clock,
    title: "Lịch sử đầy đủ",
    description:
      "Ghi nhận toàn bộ thao tác: tải lên, phát hành, tạm ngưng, chỉnh sửa với thời gian chi tiết.",
  },
  {
    icon: Users,
    title: "Đa vai trò truy cập",
    description:
      "Hỗ trợ người gửi công khai, người xem và quản trị viên với quyền hạn phù hợp.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Tải lên hồ sơ",
    description:
      "Người dùng cung cấp thông tin metadata và tệp đính kèm qua form upload online.",
  },
  {
    number: "02",
    title: "Chờ đọc duyệt",
    description:
      "Hệ thống gán trạng thái chờ duyệt và thông báo đến quản trị viên.",
  },
  {
    number: "03",
    title: "Rà soát bản quyền",
    description:
      "Quản trị viên xác minh tính hợp lệ, kiểm tra thời hạn bản quyền.",
  },
  {
    number: "04",
    title: "Phát hành công khai",
    description:
      "Phát hành xuất bản phẩm điện tử được công bố trên dữ liệu số, sẵn sàng để tra cứu.",
  },
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
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="gradient-hero overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="reveal space-y-6">
              <div className="eyebrow">Phát hành xuất bản phẩm điện tử</div>
              <h1 className="display-title text-[var(--foreground)]">
                Nền tảng công bố và quản trị
                <span className="text-[var(--accent)]">
                  {" "}
                  phát hành xuất bản phẩm điện tử
                </span>
              </h1>
              <p className="body-text max-w-xl">
                Tra cứu nhanh theo tiêu đề hoặc tác giả, xem trực tiếp các định
                dạng phổ biến và theo dõi rõ trạng thái phát hành trong một
                không gian lưu hành tập trung, minh bạch.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/upload">
                    <Upload className="h-4 w-4" />
                    <span className="text-white">
                      Gửi phát hành xuất bản phẩm điện tử
                    </span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/gioi-thieu">
                    Tìm hiểu hệ thống
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="reveal reveal-delay-2 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-5">
              <StatCard
                icon={BookOpenCheck}
                value={String(stats.total)}
                label="Tổng bản ghi công khai"
                color="sky"
              />
              <StatCard
                icon={FileCheck2}
                value={String(stats.published)}
                label="Đã phát hành"
                color="emerald"
              />
              <StatCard
                icon={Lock}
                value={String(stats.suspended)}
                label="Tạm ngưng"
                color="amber"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal text-center">
            <div className="eyebrow">Tính năng nổi bật</div>
            <h2 className="section-title mt-3">
              Giải pháp toàn diện cho hệ thống phát hành xuất bản phẩm điện tử
            </h2>
            <div className="mt-4 flex justify-center">
              <p className="body-text max-w-2xl text-center">
                Từ tiếp nhận hồ sơ, đọc duyệt nội dung đến phát hành công khai –
                tất cả trong một hệ thống duy nhất.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`reveal reveal-delay-${Math.min(index + 1, 5)} surface-card hover-lift p-6 cursor-pointer`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS SECTION ===== */}
      <section className="gradient-section py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal text-center">
            <div className="eyebrow">Quy trình xử lý</div>
            <h2 className="section-title mt-3">
              Bốn bước từ tải lên đến hệ thống phát hành xuất bản phẩm điện tử
            </h2>
            <div className="mt-4 flex justify-center">
              <p className="body-text max-w-2xl text-center">
                Quy trình được chuẩn hóa giúp đảm bảo tính minh bạch và kiểm
                soát chất lượng nội dung.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className={`reveal reveal-delay-${Math.min(index + 1, 5)} relative`}
              >
                <div className="surface-card p-6 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] text-white font-heading text-lg font-bold shadow-md">
                    {step.number}
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[var(--primary-300)]">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PUBLICATIONS LIST SECTION ===== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal">
            <div className="eyebrow">Dữ liệu số</div>
            <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="section-title">
                  Tìm kiếm xuất bản phẩm điện tử
                </h2>
                <p className="body-text mt-2 max-w-xl">
                  Tìm kiếm và tra cứu các xuất bản phẩm điện tử đã được đọc
                  duyệt trên hệ thống.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/upload">
                  <Upload className="h-4 w-4" />
                  Gửi phát hành xuất bản phẩm điện tử mới
                </Link>
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
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

          {/* Publications Grid */}
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

      {/* ===== WHY CHOOSE SECTION ===== */}
      <section className="gradient-section py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="eyebrow">Tại sao chọn IIT</div>
              <h2 className="section-title">
                Nền tảng phát hành xuất bản phẩm điện tử
              </h2>
              <p className="body-text">
                Được thiết kế cho các tổ chức cần một quy trình tiếp nhận, đọc
                duyệt và phát hành nội dung số rõ ràng, minh bạch và có kiểm
                soát.
              </p>
              <div className="space-y-4">
                {[
                  "Quy trình đọc duyệt hai lớp: nội dung và bản quyền",
                  "Hỗ trợ đa định dạng: PDF, ảnh, video, audio",
                  "Lịch sử thao tác chi tiết, minh bạch",
                  "Giao diện thân thiện, dễ sử dụng",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <Button asChild>
                <Link to="/gioi-thieu">
                  <span className="text-white">Tìm hiểu thêm</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Visual Card */}
            <div className="reveal reveal-delay-2">
              <div className="rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] p-8 text-white shadow-xl">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-white/10 p-4 backdrop-blur-sm">
                    <div>
                      <div className="text-xs text-white/70">
                        Tổng số xuất bản phẩm điện tử
                      </div>
                      <div className="mt-1 font-heading text-2xl font-bold">
                        {stats.total}+
                      </div>
                    </div>
                    <BookOpenCheck className="h-8 w-8 text-white/40" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[var(--radius-sm)] bg-white/10 p-4 backdrop-blur-sm">
                      <div className="text-xs text-white/70">Đã phát hành</div>
                      <div className="mt-1 font-heading text-xl font-bold">
                        {stats.published}
                      </div>
                    </div>
                    <div className="rounded-[var(--radius-sm)] bg-white/10 p-4 backdrop-blur-sm">
                      <div className="text-xs text-white/70">Tạm ngưng</div>
                      <div className="mt-1 font-heading text-xl font-bold">
                        {stats.suspended}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-white/20 p-4">
                    <div className="text-sm font-medium">
                      Quy trình hoạt động liên tục 24/7
                    </div>
                    <p className="mt-1 text-xs text-white/70">
                      Hệ thống sẵn sàng tiếp nhận và xử lý mọi lúc, mọi nơi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal gradient-cta overflow-hidden rounded-[var(--radius-xl)] p-10 text-center text-white shadow-xl md:p-16">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              Sẵn sàng phát hành xuất bản phẩm điện tử?
            </h2>
            <div className="mt-4 flex justify-center">
              <p className="max-w-lg text-center text-sm leading-relaxed text-white/80">
                Bắt đầu quy trình tiếp nhận và đọc duyệt ngay hôm nay. Hệ thống
                hỗ trợ nhiều định dạng tệp và xử lý nhanh chóng.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="border-0 bg-white from-white to-white !text-[var(--primary-700)] shadow-lg hover:bg-white/90 hover:!text-[var(--primary-700)] [&_svg]:!text-[var(--primary-700)]"
              >
                <Link to="/upload">
                  <Upload className="h-4 w-4" />
                  Tải lên ngay
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="border-0 bg-white from-white to-white !text-[var(--primary-700)] shadow-lg hover:bg-white/90 hover:!text-[var(--primary-700)] [&_svg]:!text-[var(--primary-700)]"
              >
                <Link to="/lien-he">
                  Liên hệ hỗ trợ
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color: "sky" | "emerald" | "amber";
}) {
  const colorClasses = {
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="surface-card hover-lift flex items-center gap-4 p-5">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border ${colorClasses[color]}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="font-heading text-2xl font-bold text-[var(--foreground)]">
          {value}
        </div>
        <div className="text-sm text-[var(--muted-foreground)]">{label}</div>
      </div>
    </div>
  );
}
