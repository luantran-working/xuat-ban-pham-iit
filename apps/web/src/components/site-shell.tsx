import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  BookOpen,
  Building2,
  ChevronRight,
  Globe,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { AdminLoginDialog } from "@/components/admin-login-dialog";
import { Button } from "@/components/ui/button";

type LoginState = {
  adminLogin?: boolean;
  from?: { pathname?: string };
};

const navLinks = [
  { to: "/", label: "Trang chủ", end: true },
  { to: "/danh-sach-xuat-ban", label: "Danh sách xuất bản" },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/lien-he", label: "Liên hệ" },
  { to: "/upload", label: "Tải lên" },
];

export function SiteShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  function handleAdminDialogChange(open: boolean) {
    setIsAdminDialogOpen(open);
    if (!open && isRouteTriggeredLogin) {
      navigate(location.pathname, { replace: true });
    }
  }

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    [
      "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-[var(--radius-sm)]",
      isActive
        ? "text-[var(--accent)] bg-[var(--accent-soft)]"
        : "text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--primary-50)]",
    ].join(" ");

  return (
    <div className="min-h-screen text-[var(--foreground)]">
      {/* Top Bar */}
      <div className="border-b border-[var(--border)] bg-[var(--primary-900)] text-white/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs md:px-8">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-[var(--primary-300)]" />
            <span>Công ty Cổ phần IIT</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:info@iit.vn"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Mail className="h-3 w-3" />
              info@iit.vn
            </a>
            <span className="hidden text-white/30 md:inline">|</span>
            <a
              href="tel:0368909968"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone className="h-3 w-3" />
              0368 909 968
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={[
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b border-[var(--border)] bg-white/95 shadow-sm backdrop-blur-xl"
            : "bg-white/80 backdrop-blur-lg",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] text-white shadow-md transition-transform duration-200 group-hover:scale-105">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="font-heading text-base font-bold tracking-tight text-[var(--foreground)]">
                IIT Publications
              </div>
              <div className="text-[11px] text-[var(--muted-foreground)] leading-tight">
                Cổng xuất bản phẩm điện tử
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={navClassName}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdminDialogOpen(true)}
            >
              <ShieldCheck className="h-4 w-4" />
              Quản trị
            </Button>
            <Button asChild size="sm">
              <Link to="/upload">
                <Upload className="h-4 w-4" />
                <span className="text-white">Tải tài liệu</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-[var(--foreground)] transition-colors hover:bg-[var(--primary-50)] lg:hidden cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-[var(--border)] bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={navClassName}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border)] pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAdminDialogOpen(true)}
              >
                <ShieldCheck className="h-4 w-4" />
                Quản trị
              </Button>
              <Button asChild size="sm">
                <Link to="/upload">
                  <Upload className="h-4 w-4" />
                  <span className="text-white">Tải tài liệu</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[var(--border)] bg-[var(--primary-900)] text-white">
        {/* Main Footer */}
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-white/10">
                  <BookOpen className="h-5 w-5 text-[var(--primary-300)]" />
                </div>
                <div>
                  <div className="font-heading text-lg font-bold">
                    IIT Publications
                  </div>
                  <div className="text-xs text-white/60">
                    Cổng xuất bản phẩm điện tử
                  </div>
                </div>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/70">
                Hệ thống xuất bản phẩm điện tử được xây dựng nhằm hỗ trợ tiếp
                nhận, kiểm duyệt, phát hành và công bố nội dung số theo quy
                trình quản trị thống nhất, rõ trạng thái và lưu vết đầy đủ.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="mailto:info@iit.vn"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href="tel:0368909968"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
                  aria-label="Điện thoại"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-300)]">
                Liên kết nhanh
              </div>
              <div className="space-y-3">
                {[
                  { to: "/", label: "Trang chủ" },
                  { to: "/danh-sach-xuat-ban", label: "Danh sách xuất bản" },
                  { to: "/gioi-thieu", label: "Giới thiệu" },
                  { to: "/upload", label: "Tải lên tài liệu" },
                  { to: "/lien-he", label: "Liên hệ" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white cursor-pointer"
                  >
                    <ChevronRight className="h-3 w-3 text-[var(--primary-400)]" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-300)]">
                Liên hệ
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-400)]" />
                  <span className="text-sm text-white/70">
                    Số 38/2D Đường Mậu Thân, Phường An Hòa, Quận Ninh Kiều, TP.
                    Cần Thơ
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-[var(--primary-400)]" />
                  <a
                    href="mailto:info@iit.vn"
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    info@iit.vn
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-[var(--primary-400)]" />
                  <a
                    href="tel:0368909968"
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    0368 909 968
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-8">
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} Công ty Cổ phần IIT. Bảo lưu mọi
              quyền.
            </p>
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span>Điều khoản sử dụng</span>
              <span>Chính sách bảo mật</span>
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
