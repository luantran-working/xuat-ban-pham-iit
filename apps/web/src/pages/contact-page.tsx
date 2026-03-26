import {
  ArrowRight,
  Building2,
  Clock,
  FileQuestion,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const contactItems = [
  {
    icon: <Mail className="h-6 w-6" />,
    label: "Email",
    value: "info@iit.vn",
    href: "mailto:info@iit.vn",
    description:
      "Kênh phù hợp để trao đổi thông tin tổng quan, đề nghị hỗ trợ và liên hệ nghiệp vụ.",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    label: "Điện thoại",
    value: "0368 909 968",
    href: "tel:0368909968",
    description:
      "Phù hợp khi cần trao đổi nhanh về vận hành hệ thống hoặc phối hợp xử lý trực tiếp.",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    label: "Địa chỉ",
    value:
      "Số 38/2D Đường Mậu Thân, Phường An Hòa, Quận Ninh Kiều, TP. Cần Thơ",
    description:
      "Trụ sở doanh nghiệp phục vụ liên hệ hành chính và xác nhận đơn vị vận hành.",
  },
];

const supportScenarios = [
  {
    icon: <HelpCircle className="h-5 w-5" />,
    title: "Hướng dẫn sử dụng",
    description:
      "Cần hỗ trợ thao tác tải lên, tra cứu xuất bản phẩm hoặc quy trình kiểm duyệt.",
  },
  {
    icon: <FileQuestion className="h-5 w-5" />,
    title: "Thắc mắc về nội dung",
    description:
      "Cần làm rõ trạng thái xuất bản phẩm, lý do tạm ngưng hoặc điều kiện phát hành.",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Phản hồi và góp ý",
    description:
      "Chia sẻ ý kiến về trải nghiệm sử dụng, đề xuất cải tiến hoặc báo lỗi hệ thống.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Bảo mật và quyền riêng tư",
    description:
      "Thắc mắc liên quan đến bảo vệ dữ liệu cá nhân và chính sách sử dụng thông tin.",
  },
];

const companyInfo = [
  {
    icon: <Building2 className="h-5 w-5" />,
    title: "Đơn vị phụ trách",
    content: "Công ty Cổ phần IIT là đơn vị trực tiếp vận hành hệ thống.",
  },
  {
    icon: <Send className="h-5 w-5" />,
    title: "Phạm vi tiếp nhận",
    content:
      "Hỗ trợ thông tin liên hệ, phối hợp vận hành và trao đổi về xuất bản phẩm.",
  },
  {
    icon: <Workflow className="h-5 w-5" />,
    title: "Luồng làm việc",
    content:
      "Tiếp nhận hồ sơ, xem xét điều kiện phát hành và công bố nội dung.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Thời gian phản hồi",
    content: "Trong vòng 1-2 ngày làm việc kể từ khi nhận được yêu cầu.",
  },
];

export function ContactPage() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="reveal grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="eyebrow">Liên hệ</div>
              <h1 className="display-title text-[var(--foreground)]">
                Kết nối với
                <span className="text-[var(--accent)]">
                  {" "}
                  Công ty Cổ phần IIT
                </span>
              </h1>
              <p className="body-text max-w-xl">
                Nếu bạn cần trao đổi về cổng xuất bản phẩm điện tử, quy trình
                công bố nội dung hoặc thông tin của đơn vị vận hành, các kênh
                dưới đây là đầu mối liên hệ chính thức.
              </p>
              <Button asChild size="lg">
                <a href="mailto:info@iit.vn">
                  <Mail className="h-4 w-4" />
                  <span className="text-white">Gửi email ngay</span>
                </a>
              </Button>
            </div>

            {/* Company Info Cards */}
            <div className="reveal reveal-delay-2 grid gap-3 sm:grid-cols-2">
              {companyInfo.map((item) => (
                <div
                  key={item.title}
                  className="surface-card p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
                      {item.icon}
                    </div>
                    <h3 className="font-heading text-sm font-semibold text-[var(--foreground)]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT CARDS ===== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal text-center">
            <div className="eyebrow">Thông tin liên hệ</div>
            <h2 className="section-title mt-3">
              Các kênh liên hệ chính thức
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {contactItems.map((item, index) => (
              <div
                key={item.label}
                className={`reveal reveal-delay-${Math.min(index + 1, 5)} surface-card hover-lift overflow-hidden`}
              >
                <div className="bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] p-5">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      {item.icon}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                      {item.label}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block font-heading text-lg font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--accent)] cursor-pointer"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div className="font-heading text-lg font-semibold text-[var(--foreground)]">
                      {item.value}
                    </div>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUPPORT SCENARIOS ===== */}
      <section className="gradient-section py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-6">
              <div className="eyebrow">Hỗ trợ</div>
              <h2 className="section-title">Khi nào nên liên hệ với IIT</h2>
              <p className="body-text">
                Một số tình huống thường gặp mà doanh nghiệp hoặc người dùng
                có thể cần trao đổi với chúng tôi.
              </p>
              <Button asChild variant="outline">
                <Link to="/gioi-thieu">
                  Tìm hiểu hệ thống
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="reveal reveal-delay-1 grid gap-4 sm:grid-cols-2">
              {supportScenarios.map((scenario) => (
                <div
                  key={scenario.title}
                  className="rounded-[var(--radius)] border border-[var(--border)] bg-white p-5 shadow-sm transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
                    {scenario.icon}
                  </div>
                  <h3 className="mt-3 font-heading text-sm font-semibold text-[var(--foreground)]">
                    {scenario.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {scenario.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAP / LOCATION ===== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-white shadow-md">
            <div className="grid lg:grid-cols-[1fr_1.2fr]">
              <div className="p-8 lg:p-10">
                <div className="eyebrow">Trụ sở chính</div>
                <h2 className="section-title mt-3">
                  Vị trí văn phòng IIT
                </h2>
                <p className="body-text mt-4">
                  Công ty Cổ phần IIT với trụ sở đặt tại trung tâm thành phố
                  Cần Thơ, thuận tiện cho giao thông và liên hệ trực tiếp.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                    <span className="text-sm text-[var(--muted-foreground)]">
                      Số 38/2D Đường Mậu Thân, Phường An Hòa, Quận Ninh Kiều,
                      TP. Cần Thơ, Việt Nam
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-[var(--accent)]" />
                    <a
                      href="tel:0368909968"
                      className="text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors"
                    >
                      0368 909 968
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-[var(--accent)]" />
                    <a
                      href="mailto:info@iit.vn"
                      className="text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors"
                    >
                      info@iit.vn
                    </a>
                  </div>
                </div>
              </div>
              <div className="h-64 bg-[var(--primary-100)] lg:h-auto">
                <iframe
                  className="h-full w-full border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.028571714063!2d105.75846637487905!3d10.014890990098778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a087f71fa50f3b%3A0x478cd8895f6e49fe!2zTcOidSBUaMOibiDEkMaw4budbmcsIEFuIEjDsmEsIE5pbmggS2nhu4F1LCBDYSBNYXUsIFZpZXRuYW0!5e0!3m2!1svi!2s!4v1711444444444!5m2!1svi!2s"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ IIT"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="reveal gradient-cta rounded-[var(--radius-xl)] p-10 text-center text-white shadow-xl md:p-16">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              Cần hỗ trợ thêm?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 leading-relaxed">
              Đội ngũ IIT luôn sẵn sàng hỗ trợ bạn trong quá trình sử dụng
              hệ thống xuất bản phẩm điện tử.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-[var(--primary-700)] hover:bg-white/90 shadow-lg border-0 from-white to-white"
              >
                <a href="mailto:info@iit.vn">
                  <Mail className="h-4 w-4" />
                  Gửi email
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                <a href="tel:0368909968">
                  <Phone className="h-4 w-4" />
                  Gọi điện
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
