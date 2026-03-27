import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  Eye,
  FileCheck2,
  Files,
  Heart,
  History,
  Layers,
  Shield,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const coreValues = [
  {
    icon: Eye,
    title: "Minh bạch",
    description:
      "Mọi hành động đều có lịch sử ghi nhận, từ tải lên đến phát hành hoặc tạm ngưng.",
  },
  {
    icon: Shield,
    title: "Bảo mật",
    description:
      "Phân quyền rõ ràng, xác thực người dùng và bảo vệ nội dung trước khi công bố.",
  },
  {
    icon: Target,
    title: "Hiệu quả",
    description:
      "Quy trình gọn nhẹ, tối ưu hóa thời gian từ tiếp nhận đến phát hành nội dung.",
  },
  {
    icon: Heart,
    title: "Thân thiện",
    description:
      "Giao diện trực quan, dễ sử dụng cho cả người gửi và quản trị viên.",
  },
];

const capabilities = [
  {
    icon: FileCheck2,
    title: "Đặc duyệt nội dung",
    description:
      "Rà soát tính phù hợp, kiểm tra bản quyền và xác nhận điều kiện phát hành.",
  },
  {
    icon: Files,
    title: "Đa định dạng",
    description:
      "Hỗ trợ PDF, hình ảnh, audio, video và các định dạng tài liệu phổ biến khác.",
  },
  {
    icon: BookOpenCheck,
    title: "Dữ liệu số công khai",
    description:
      "Phát hành phẩm được trình bày trên danh mục nhất quán, dễ tra cứu và khai thác.",
  },
  {
    icon: History,
    title: "Lịch sử thao tác",
    description:
      "Ghi nhận chi tiết mọi hành động: tải lên, chỉnh sửa, phát hành, tạm ngưng.",
  },
  {
    icon: Layers,
    title: "Quản trị tập trung",
    description:
      "Một bảng điều khiển duy nhất cho toàn bộ hoạt động quản lý phát hành phẩm.",
  },
  {
    icon: Users,
    title: "Đa vai trò",
    description:
      "Phân biệt rõ người gửi, người xem công khai và quản trị viên hệ thống.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Tiếp nhận hồ sơ công khai",
    description:
      "Người dùng gửi nhiều tệp cùng metadata cơ bản, hệ thống tạo bản ghi mới ở trạng thái chờ duyệt.",
  },
  {
    step: "02",
    title: "Rà soát và kiểm tra bản quyền",
    description:
      "Quản trị viên xem xét tính phù hợp, xác minh thời hạn bản quyền và quyết định phát hành.",
  },
  {
    step: "03",
    title: "Phát hành hoặc tạm ngưng",
    description:
      "Mỗi quyết định đều yêu cầu ghi chú xử lý, đồng thời cập nhật lịch sử thao tác.",
  },
  {
    step: "04",
    title: "Công bố ra giao diện công khai",
    description:
      "Bản phát hành được mở xem trực tiếp; bản tạm ngưng vẫn có trong danh mục nhưng bị khóa.",
  },
];

const stats = [
  { value: "24/7", label: "Hệ thống hoạt động" },
  { value: "100%", label: "Lưu vết đầy đủ" },
  { value: "5+", label: "Định dạng hỗ trợ" },
  { value: "2 lớp", label: "Đặc duyệt" },
];

export function AboutPage() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="reveal grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <div className="eyebrow">Về chúng tôi</div>
              <h1 className="display-title text-[var(--foreground)]">
                Nền tảng phát hành số với trọng tâm
                <span className="text-[var(--accent)]"> đặc duyệt </span>
                và công bố minh bạch
              </h1>
              <p className="body-text max-w-xl">
                Cổng phát hành phẩm điện tử của Công ty Cổ phần IIT được xây
                dựng để tiếp nhận tài liệu từ người dùng công khai, tổ chức
                quy trình rà soát tập trung và phát hành nội dung trên một
                dữ liệu số rõ trạng thái, dễ theo dõi.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/upload">
                    <span className="text-white">Bắt đầu gửi phát hành phẩm</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/lien-he">Liên hệ với IIT</Link>
                </Button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="reveal reveal-delay-2 space-y-4">
              <InfoCard
                icon={<Building2 className="h-5 w-5" />}
                title="Đơn vị vận hành"
              >
                Công ty Cổ phần IIT là đơn vị trực tiếp vận hành, quản trị và
                định hướng sử dụng hệ thống.
              </InfoCard>
              <InfoCard
                icon={<Workflow className="h-5 w-5" />}
                title="Quy trình tập trung"
              >
                Hồ sơ được tải lên, chuyển trạng thái chờ duyệt, xem xét bản
                quyền rồi mới phát hành ra giao diện công khai.
              </InfoCard>
              <InfoCard
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Kiểm soát minh bạch"
              >
                Mọi thao tác phát hành, tạm ngưng và chỉnh sửa quan trọng đều
                có ghi chú và lịch sử đi kèm.
              </InfoCard>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="border-y border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="reveal text-center">
                <div className="font-heading text-3xl font-bold text-[var(--accent)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CORE VALUES ===== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal text-center">
            <div className="eyebrow">Giá trị cốt lõi</div>
            <h2 className="section-title mt-3">
              Nguyên tắc vận hành của hệ thống
            </h2>
            <p className="body-text mx-auto mt-4 max-w-2xl">
              Bốn giá trị nền tảng định hình cách hệ thống tiếp nhận, xử lý
              và công bố phát hành phẩm.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className={`reveal reveal-delay-${Math.min(index + 1, 5)} surface-card hover-lift p-6 text-center cursor-pointer`}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-[var(--foreground)]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className="gradient-section py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal text-center">
            <div className="eyebrow">Năng lực hệ thống</div>
            <h2 className="section-title mt-3">
              Khả năng đáp ứng đa dạng nhu cầu
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap, index) => (
              <div
                key={cap.title}
                className={`reveal reveal-delay-${Math.min(index + 1, 5)} flex items-start gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--border-strong)] cursor-pointer`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
                  <cap.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-[var(--foreground)]">
                    {cap.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {cap.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WORKFLOW ===== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-6">
              <div className="eyebrow">Luồng hoạt động</div>
              <h2 className="section-title">
                Quy trình nghiệp vụ của hệ thống
              </h2>
              <p className="body-text">
                Các bước được tổ chức để vừa tạo thuận lợi cho người dùng gửi nội
                dung, vừa hỗ trợ quản trị viên đặc duyệt có kiểm soát.
              </p>
              <div className="rounded-[var(--radius)] bg-[var(--accent-soft)] p-5">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[var(--accent)]" />
                  <span className="font-heading text-sm font-semibold text-[var(--primary-700)]">
                    Cam kết chất lượng
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Chỉ những phát hành phẩm đạt tiêu chuẩn mới được công bố trên
                  dữ liệu số công khai.
                </p>
              </div>
            </div>

            <div className="reveal reveal-delay-1 space-y-4">
              {workflowSteps.map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-white p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] text-sm font-bold text-white shadow-md">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-[var(--foreground)]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal gradient-cta rounded-[var(--radius-xl)] p-10 text-center text-white shadow-xl md:p-16">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              Bắt đầu sử dụng hệ thống ngay hôm nay
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 leading-relaxed">
              Tải lên phát hành phẩm mới hoặc liên hệ với IIT để được hỗ trợ
              thêm.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="border-0 bg-white from-white to-white !text-[var(--primary-700)] shadow-lg hover:bg-white/90 hover:!text-[var(--primary-700)] [&_svg]:!text-[var(--primary-700)]"
              >
                <Link to="/upload">Gửi phát hành phẩm</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 !text-white hover:border-white/50 hover:bg-white/10 hover:!text-white [&_svg]:!text-white"
              >
                <Link to="/lien-he">
                  Liên hệ
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

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="surface-card hover-lift flex items-start gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
        {icon}
      </div>
      <div>
        <h3 className="font-heading text-sm font-semibold text-[var(--foreground)]">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {children}
        </p>
      </div>
    </div>
  );
}
