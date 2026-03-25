import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  BookCopy,
  Building2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { AdminLoginDialog } from "@/components/admin-login-dialog";
import { Button } from "@/components/ui/button";

type LoginState = {
  adminLogin?: boolean;
  from?: { pathname?: string };
};

export function SiteShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  const routeState = (location.state as LoginState | null) ?? null;
  const isRouteTriggeredLogin = Boolean(routeState?.adminLogin);
  const adminRedirectTarget = useMemo(
    () => routeState?.from?.pathname ?? "/admin/publications",
    [routeState?.from?.pathname],
  );

  useEffect(() => {
    if (isRouteTriggeredLogin) {
      setIsAdminDialogOpen(true);
    }
  }, [isRouteTriggeredLogin]);

  function handleAdminDialogChange(open: boolean) {
    setIsAdminDialogOpen(open);

    if (!open && isRouteTriggeredLogin) {
      navigate(location.pathname, { replace: true });
    }
  }

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-200",
      isActive
        ? "bg-blue-300 text-white"
        : "text-[var(--muted-foreground)] hover:bg-white/72 hover:text-[var(--foreground)]",
    ].join(" ");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="border-b border-white/70 bg-[rgba(255,255,255,0.66)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm text-[var(--muted-foreground)] md:px-8">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[var(--accent)]" />
            <span>Công ty Cổ phần IIT</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:info@iit.vn"
              className="transition hover:text-[var(--accent)]"
            >
              info@iit.vn
            </a>
            <span className="hidden md:inline">|</span>
            <a
              href="tel:0368909968"
              className="transition hover:text-[var(--accent)]"
            >
              0368 909 968
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-white/70 bg-[rgba(248,251,255,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <Link to="/" className="reveal flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[var(--accent)] text-white shadow-sm">
                <BookCopy className="h-5 w-5" />
              </div>
              <div>
                <div className="font-heading text-lg font-bold uppercase tracking-[0.08em]">
                  IIT Publications
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  Cổng xuất bản phẩm điện tử, quản trị minh bạch và lưu hành tập
                  trung
                </div>
              </div>
            </Link>

            <div className="reveal reveal-delay-1 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-w-32"
                onClick={() => setIsAdminDialogOpen(true)}
              >
                <ShieldCheck className="h-4 w-4" />
                Quản trị
              </Button>
              <Button
                asChild
                size="sm"
                className="min-w-36 text-white [&_svg]:text-white"
              >
                <Link to="/upload">
                  <Upload className="h-4 w-4" />
                  <p className="text-white">Tải tài liệu</p>
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="reveal reveal-delay-2 flex flex-wrap items-center gap-2">
              <NavLink to="/" end className={navClassName}>
                Trang chủ
              </NavLink>
              <NavLink to="/gioi-thieu" className={navClassName}>
                Giới thiệu IIT
              </NavLink>
              <NavLink to="/lien-he" className={navClassName}>
                Liên hệ chúng tôi
              </NavLink>
              <NavLink to="/upload" className={navClassName}>
                Tải lên xuất bản
              </NavLink>
            </nav>

            <div className="reveal reveal-delay-3 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <div className="rounded-sm border border-[var(--border)] bg-white/75 px-3 py-2">
                Hỗ trợ nhiều định dạng khác nhau
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-white/70 bg-[rgba(255,255,255,0.72)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-8">
          <div className="grid gap-5">
            <div>
              <div className="eyebrow">Thông tin đơn vị</div>
              <div className="mt-3 font-heading text-2xl font-semibold">
                Công ty Cổ phần IIT
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
                Hệ thống xuất bản phẩm điện tử được xây dựng nhằm hỗ trợ tiếp
                nhận, kiểm duyệt, phát hành và công bố nội dung số theo một quy
                trình quản trị thống nhất, rõ trạng thái và lưu vết đầy đủ.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-sm border border-[var(--border)] bg-white/82 p-4">
                <div className="font-heading text-sm font-semibold">
                  Mục tiêu vận hành
                </div>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Tạo một không gian xuất bản số có khả năng công bố minh bạch,
                  quản trị tập trung và hỗ trợ kiểm soát nội dung hiệu quả.
                </p>
              </div>
              <div className="rounded-sm border border-[var(--border)] bg-white/82 p-4">
                <div className="font-heading text-sm font-semibold">
                  Định hướng sử dụng
                </div>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Phù hợp cho quy trình tiếp nhận công khai, phát hành sau kiểm
                  duyệt và hiển thị lịch sử thao tác của từng xuất bản phẩm.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-[var(--muted-foreground)]">
            <div className="rounded-sm border border-[var(--border)] bg-white/82 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                <div>
                  <div className="font-heading text-sm font-semibold text-[var(--foreground)]">
                    Email
                  </div>
                  <a
                    href="mailto:info@iit.vn"
                    className="mt-1 block hover:text-[var(--accent)]"
                  >
                    info@iit.vn
                  </a>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-[var(--border)] bg-white/82 p-4">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                <div>
                  <div className="font-heading text-sm font-semibold text-[var(--foreground)]">
                    Điện thoại
                  </div>
                  <a
                    href="tel:0368909968"
                    className="mt-1 block hover:text-[var(--accent)]"
                  >
                    0368 909 968
                  </a>
                </div>
              </div>
            </div>
            <div className="rounded-sm border border-[var(--border)] bg-white/82 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                <div>
                  <div className="font-heading text-sm font-semibold text-[var(--foreground)]">
                    Địa chỉ
                  </div>
                  <div className="mt-1 leading-7">
                    Số 38/2D Đường Mậu Thân, Phường An Hòa, Quận Ninh Kiều,
                    Thành phố Cần Thơ, Việt Nam
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AdminLoginDialog
        open={isAdminDialogOpen}
        onOpenChange={handleAdminDialogChange}
        redirectTo={adminRedirectTarget}
      />
    </div>
  );
}
