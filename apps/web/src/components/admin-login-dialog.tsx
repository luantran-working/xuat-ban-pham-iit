import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { adminLogin } from "@/lib/api";
import { setAdminToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type AdminLoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
};

export function AdminLoginDialog({
  open,
  onOpenChange,
  redirectTo = "/admin/publications",
}: AdminLoginDialogProps) {
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) =>
      adminLogin(values.username, values.password),
    onSuccess: (result) => {
      setAdminToken(result.accessToken);
      onOpenChange(false);
      navigate(redirectTo, { replace: true });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 min-w-3xl">
        <div className="grid md:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel border-x-0 border-y-0 border-r border-r-white/70 bg-[linear-gradient(180deg,rgba(29,111,220,0.16),rgba(255,255,255,0.92))] p-7">
            <div className="eyebrow">Khu vực quản trị</div>
            <DialogHeader className="mt-4">
              <DialogTitle className="section-title">
                Đăng nhập quản trị
              </DialogTitle>
              <DialogDescription className="text-sm leading-7">
                Dành cho quản trị viên đọc duyệt, phát hành và quản lý lịch sử
                thao tác của phát hành xuất bản phẩm điện tử.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid gap-4">
              <div className="rounded-sm border border-[var(--border)] bg-white/82 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--accent)] text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-heading text-sm font-semibold">
                      Đọc duyệt tập trung
                    </div>
                    <p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">
                      Rà soát trạng thái bản quyền, quyết định phát hành hoặc
                      tạm ngưng và lưu đầy đủ ghi chú xử lý.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-sm border border-[var(--border)] bg-white/82 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--card-soft)] text-[var(--accent)]">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-heading text-sm font-semibold">
                      Thông tin đăng nhập
                    </div>
                    <div className="mt-2 grid gap-1 text-sm text-[var(--muted-foreground)]">
                      <div>
                        Tên đăng nhập:{" "}
                        <strong className="text-[var(--foreground)]">
                          admin
                        </strong>
                      </div>
                      <div>
                        Mật khẩu:{" "}
                        <strong className="text-[var(--foreground)]">
                          **************
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-7">
            <form
              className="grid gap-5"
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            >
              <div className="grid gap-2">
                <Label htmlFor="admin-username">Tên đăng nhập</Label>
                <Input id="admin-username" {...form.register("username")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-password">Mật khẩu</Label>
                <Input
                  id="admin-password"
                  type="password"
                  {...form.register("password")}
                />
              </div>
              {mutation.error ? (
                <div className="rounded-sm border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {(mutation.error as Error).message}
                </div>
              ) : null}
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="submit"
                  className="min-w-44"
                  disabled={mutation.isPending}
                >
                  <LockKeyhole className="h-4 w-4" />
                  {mutation.isPending ? "Đang đăng nhập..." : "Vào quản trị"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
