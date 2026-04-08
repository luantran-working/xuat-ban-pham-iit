import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getGuestAuthenticated, setGuestAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GuestProtectedProps {
  children: React.ReactNode;
}

export function GuestProtected({ children }: GuestProtectedProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(getGuestAuthenticated());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập xử lý đăng nhập
    setTimeout(() => {
      if (username === 'khachhang' && password === '123456') {
        setGuestAuthenticated(true);
        setIsAuthenticated(true);
        toast.success('Đăng nhập thành công! Chào mừng khách hàng.');
      } else {
        toast.error('Tài khoản hoặc mật khẩu không chính xác.');
      }
      setIsLoading(false);
    }, 800);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20 gradient-hero">
      <Card className="reveal w-full max-w-md overflow-hidden border-none shadow-2xl ring-1 ring-[var(--border-strong)] bg-white/80 backdrop-blur-xl">
        <div className="h-2 bg-gradient-cta" />
        <CardHeader className="space-y-4 pt-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--accent-soft)] text-[var(--accent)] shadow-inner transition-transform hover:scale-105 duration-500">
            <Lock className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <CardTitle className="font-heading text-3xl font-bold tracking-tight">Quyền truy cập hạn chế</CardTitle>
            <CardDescription className="text-base text-[var(--muted-foreground)]">
              Vui lòng xác thực thông tin khách hàng để xem chi tiết nội dung phát hành phẩm.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-[var(--foreground)] ml-1"
              >
                Tài khoản khách hàng
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 border-[var(--border-strong)] bg-white/50 transition-all focus:ring-4 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[var(--foreground)]"
                >
                  Mật khẩu truy cập
                </label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-[var(--border-strong)] bg-white/50 transition-all focus:ring-4 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] rounded-xl"
              />
            </div>
            <Button
              type="submit"
              className="group relative h-13 w-full overflow-hidden text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl gradient-cta border-none"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-3 border-white/30 border-t-white" />
                ) : (
                  <>
                    Mở khóa truy cập
                    <ShieldCheck className="h-6 w-6 transition-transform group-hover:rotate-12" />
                  </>
                )}
              </span>
            </Button>
          </form>
          
          <div className="mt-10 rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)]/40 p-5 text-center transition-all hover:bg-[var(--accent-soft)]/60">
            <p className="text-[10px] font-bold text-[var(--accent-strong)] uppercase tracking-[0.2em]">
              Thông tin đăng nhập gợi ý
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <span className="text-[var(--muted-foreground)]">User:</span>
              <code className="bg-white px-2 py-0.5 rounded border border-[var(--accent-soft)] font-bold text-[var(--accent-strong)]">khachhang</code>
              <span className="text-[var(--muted-foreground)] ml-1">Pass:</span>
              <code className="bg-white px-2 py-0.5 rounded border border-[var(--accent-soft)] font-bold text-[var(--accent-strong)]">123456</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
