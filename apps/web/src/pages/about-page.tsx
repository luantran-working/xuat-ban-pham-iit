import type { ReactNode } from "react";
import {
  BookOpenText,
  Building2,
  CheckCircle2,
  Files,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <section className="glass-panel reveal overflow-hidden rounded-sm p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5">
            <div className="eyebrow">Giới thiệu hệ thống</div>
            <div className="display-title font-heading font-semibold">
              Nền tảng xuất bản số với trọng tâm là kiểm duyệt và công bố minh
              bạch
            </div>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">
              Cổng xuất bản phẩm điện tử của Công ty Cổ phần IIT được xây dựng
              để tiếp nhận tài liệu từ người dùng công khai, tổ chức quy trình
              rà soát tập trung và phát hành nội dung trên một thư viện số rõ
              trạng thái, dễ theo dõi và dễ khai thác.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="text-white [&_svg]:text-white">
                <Link to="/upload">
                  <p className="text-white">Bắt đầu gửi xuất bản phẩm</p>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/lien-he">Liên hệ với IIT</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <InfoStat
              icon={<Building2 className="h-5 w-5" />}
              title="Đơn vị vận hành"
            >
              Công ty Cổ phần IIT là đơn vị trực tiếp vận hành, quản trị và định
              hướng sử dụng hệ thống.
            </InfoStat>
            <InfoStat
              icon={<Workflow className="h-5 w-5" />}
              title="Quy trình tập trung"
            >
              Hồ sơ được tải lên, chuyển trạng thái chờ duyệt, xem xét bản quyền
              rồi mới phát hành ra giao diện công khai.
            </InfoStat>
            <InfoStat
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Kiểm soát minh bạch"
            >
              Mọi thao tác phát hành, tạm ngưng và chỉnh sửa quan trọng đều có
              ghi chú và lịch sử ghi nhận đi kèm.
            </InfoStat>
          </div>
        </div>
      </section>

      <section className="reveal reveal-delay-1 mt-8 grid gap-6 lg:grid-cols-3">
        <FeatureCard
          icon={<BookOpenText className="h-5 w-5" />}
          title="Không gian lưu hành tập trung"
          description="Thay vì lưu trữ rời rạc, xuất bản phẩm được trình bày trên một danh mục công khai nhất quán, giúp việc tra cứu và sử dụng thuận tiện hơn."
        />
        <FeatureCard
          icon={<Files className="h-5 w-5" />}
          title="Hỗ trợ nội dung đa định dạng"
          description="Hệ thống tiếp nhận nhiều loại tệp và ưu tiên trải nghiệm preview trực tiếp cho những định dạng phổ biến như PDF, ảnh, audio và video."
        />
        <FeatureCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="Phù hợp quy trình kiểm duyệt"
          description="Trạng thái xuất bản phẩm được biểu diễn rõ ràng, giúp phân tách nội dung chờ duyệt với nội dung đã công bố hoặc đang tạm ngưng."
        />
      </section>

      <section className="reveal reveal-delay-2 mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-[var(--border)]">
          <CardHeader>
            <div className="eyebrow">Nguyên tắc vận hành</div>
            <CardTitle className="section-title">
              Ba lớp giá trị cốt lõi
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ValueItem
              title="Rõ trách nhiệm"
              description="Hành động của người gửi và quản trị viên đều có dấu vết, tránh xử lý cảm tính hoặc thiếu căn cứ."
            />
            <ValueItem
              title="Rõ trạng thái"
              description="Mỗi bản ghi luôn nằm trong một trạng thái cụ thể để người dùng công khai và người quản trị đều nắm được tình hình hiện tại."
            />
            <ValueItem
              title="Rõ khả năng truy cập"
              description="Nội dung được phát hành có thể xem trực tiếp; nội dung tạm ngưng vẫn hiển thị nhưng bị khóa truy cập để giữ tính minh bạch."
            />
          </CardContent>
        </Card>

        <Card className="border-[var(--border)]">
          <CardHeader>
            <div className="eyebrow">Luồng hoạt động</div>
            <CardTitle className="section-title">
              Quy trình nghiệp vụ của hệ thống
            </CardTitle>
            <CardDescription>
              Các bước được tổ chức để vừa tạo thuận lợi cho người dùng gửi nội
              dung, vừa hỗ trợ quản trị viên kiểm duyệt có kiểm soát.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <TimelineStep
              step="01"
              title="Tiếp nhận hồ sơ công khai"
              description="Người dùng gửi nhiều tệp cùng metadata cơ bản, hệ thống tạo bản ghi mới ở trạng thái chờ duyệt."
            />
            <TimelineStep
              step="02"
              title="Rà soát và kiểm tra bản quyền"
              description="Quản trị viên xem xét tính phù hợp của xuất bản phẩm và xác định khả năng phát hành."
            />
            <TimelineStep
              step="03"
              title="Phát hành hoặc tạm ngưng"
              description="Mỗi quyết định đều yêu cầu ghi chú xử lý, đồng thời cập nhật lịch sử thao tác để theo dõi lâu dài."
            />
            <TimelineStep
              step="04"
              title="Công bố ra giao diện công khai"
              description="Bản phát hành được mở xem trực tiếp; bản tạm ngưng vẫn xuất hiện trong danh mục nhưng bị khóa nội dung."
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function InfoStat({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="hover-lift rounded-sm border border-[var(--border)] bg-white/82 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[var(--card-soft)] text-[var(--accent)]">
          {icon}
        </div>
        <div>
          <div className="font-heading text-sm font-semibold">{title}</div>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="hover-lift border-[var(--border)]">
      <CardContent className="p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[var(--card-soft)] text-[var(--accent)]">
          {icon}
        </div>
        <div className="mt-4 font-heading text-lg font-semibold">{title}</div>
        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function ValueItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--card-soft)] p-4">
      <div className="font-heading text-sm font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

function TimelineStep({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-3 rounded-sm border border-[var(--border)] bg-white/82 p-4 md:grid-cols-[auto_1fr] md:items-start">
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--accent)] text-sm font-semibold text-white">
        {step}
      </div>
      <div>
        <div className="font-heading text-sm font-semibold">{title}</div>
        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
    </div>
  );
}
