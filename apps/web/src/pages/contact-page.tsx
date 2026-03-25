import type { ReactNode } from 'react';
import { Building2, Mail, MapPin, Phone, Send, ShieldCheck, Workflow } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const contactItems = [
  {
    icon: <Mail className="h-5 w-5" />,
    label: 'Email',
    value: 'info@iit.vn',
    href: 'mailto:info@iit.vn',
    description: 'Kênh phù hợp để trao đổi thông tin tổng quan, đề nghị hỗ trợ và liên hệ nghiệp vụ.',
  },
  {
    icon: <Phone className="h-5 w-5" />,
    label: 'Điện thoại',
    value: '0368 909 968',
    href: 'tel:0368909968',
    description: 'Phù hợp khi cần trao đổi nhanh về vận hành hệ thống hoặc phối hợp xử lý trực tiếp.',
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    label: 'Địa chỉ',
    value:
      'Số 38/2D Đường Mậu Thân, Phường An Hòa, Quận Ninh Kiều, Thành phố Cần Thơ, Việt Nam',
    description: 'Thông tin trụ sở doanh nghiệp phục vụ liên hệ hành chính và xác nhận đơn vị vận hành.',
  },
];

export function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <section className="glass-panel reveal rounded-sm p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="grid gap-5">
            <div className="eyebrow">Liên hệ và phối hợp</div>
            <div className="display-title font-heading font-semibold">
              Kết nối với Công ty Cổ phần IIT
            </div>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">
              Nếu bạn cần trao đổi về cổng xuất bản phẩm điện tử, quy trình công bố nội dung hoặc
              thông tin của đơn vị vận hành, các kênh dưới đây là đầu mối liên hệ chính thức.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <MiniInfo icon={<Building2 className="h-5 w-5" />} title="Đơn vị phụ trách">
              Công ty Cổ phần IIT là đơn vị trực tiếp vận hành hệ thống.
            </MiniInfo>
            <MiniInfo icon={<Send className="h-5 w-5" />} title="Phạm vi tiếp nhận">
              Hỗ trợ thông tin liên hệ, phối hợp vận hành và trao đổi liên quan đến xuất bản phẩm.
            </MiniInfo>
            <MiniInfo icon={<ShieldCheck className="h-5 w-5" />} title="Trọng tâm quản trị">
              Kiểm duyệt, phát hành, tạm ngưng và lưu lịch sử xử lý bản ghi.
            </MiniInfo>
            <MiniInfo icon={<Workflow className="h-5 w-5" />} title="Luồng làm việc">
              Tiếp nhận hồ sơ, xem xét điều kiện phát hành và công bố nội dung sau kiểm duyệt.
            </MiniInfo>
          </div>
        </div>
      </section>

      <section className="reveal reveal-delay-1 mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
          {contactItems.map((item) => (
            <Card key={item.label} className="hover-lift border-[var(--border)]">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[var(--card-soft)] text-[var(--accent)]">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-2 block font-heading text-lg font-semibold text-[var(--foreground)] transition hover:text-[var(--accent)]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div className="mt-2 font-heading text-lg font-semibold text-[var(--foreground)]">
                      {item.value}
                    </div>
                  )}
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-[var(--border)]">
          <CardHeader>
            <div className="eyebrow">Hướng dẫn liên hệ</div>
            <CardTitle className="section-title">Khi nào nên liên hệ với IIT</CardTitle>
            <CardDescription>
              Một số tình huống thường gặp mà doanh nghiệp hoặc người dùng có thể cần trao đổi.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ContactReason
              title="Cần xác nhận đầu mối vận hành"
              description="Phù hợp khi cần biết rõ đơn vị chịu trách nhiệm quản trị và điều phối hệ thống xuất bản phẩm điện tử."
            />
            <ContactReason
              title="Cần trao đổi về quy trình công bố"
              description="Thích hợp khi cần tìm hiểu cách tiếp nhận hồ sơ, kiểm duyệt và công bố nội dung sau phát hành."
            />
            <ContactReason
              title="Cần hỗ trợ thông tin doanh nghiệp"
              description="Dùng khi cần đối chiếu dữ liệu liên hệ, địa chỉ trụ sở hoặc thông tin hành chính của Công ty Cổ phần IIT."
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MiniInfo({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-sm border border-[var(--border)] bg-white/82 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--card-soft)] text-[var(--accent)]">
          {icon}
        </div>
        <div>
          <div className="font-heading text-sm font-semibold">{title}</div>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{children}</p>
        </div>
      </div>
    </div>
  );
}

function ContactReason({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--card-soft)] p-4">
      <div className="font-heading text-sm font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>
    </div>
  );
}
