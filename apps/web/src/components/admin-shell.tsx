import { NavLink, Outlet } from 'react-router-dom';
import { History, LogOut, ScrollText } from 'lucide-react';
import { clearAdminToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export function AdminShell() {
  const navClassName = ({ isActive }: { isActive: boolean }) =>
    [
      'inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-[var(--accent)] text-white'
        : 'bg-white/70 text-[var(--muted-foreground)] hover:bg-white hover:text-[var(--foreground)]',
    ].join(' ');

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="flex flex-col gap-4 border border-white/70 bg-[var(--panel)] p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
            Khu vực quản trị
          </div>
          <h1 className="mt-2 font-heading text-3xl font-semibold">Quản trị xuất bản phẩm</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/admin/publications" className={navClassName}>
            <ScrollText className="h-4 w-4" />
            Danh sách xuất bản phẩm
          </NavLink>
          <NavLink to="/admin/history" className={navClassName}>
            <History className="h-4 w-4" />
            Lịch sử ghi nhận
          </NavLink>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearAdminToken();
              window.location.href = '/admin/login';
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
