import { NavLink, Outlet } from "react-router-dom";
import { History, LogOut, ScrollText } from "lucide-react";
import { clearAdminToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function AdminShell() {
  const navClassName = ({ isActive }: { isActive: boolean }) =>
    [
      "inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
      isActive
        ? "bg-[var(--accent)] text-white shadow-sm"
        : "text-[var(--muted-foreground)] hover:bg-[var(--primary-50)] hover:text-[var(--foreground)]",
    ].join(" ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="eyebrow">Khu vực quản trị</div>
          <h1 className="mt-2 font-heading text-2xl font-bold text-[var(--foreground)]">
            Quản trị xuất bản phẩm
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/admin/publications" className={navClassName}>
            <ScrollText className="h-4 w-4" />
            Danh sách
          </NavLink>
          <NavLink to="/admin/history" className={navClassName}>
            <History className="h-4 w-4" />
            Lịch sử
          </NavLink>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearAdminToken();
              window.location.href = "/admin/login";
            }}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
