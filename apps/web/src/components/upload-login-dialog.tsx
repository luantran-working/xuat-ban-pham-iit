import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleUserRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { setUploadUserAuthenticated } from "@/lib/auth";
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

type UploadLoginFormValues = z.infer<typeof loginSchema>;

type UploadLoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: () => void;
};

export function UploadLoginDialog({
  open,
  onOpenChange,
  onAuthenticated,
}: UploadLoginDialogProps) {
  const form = useForm<UploadLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "user",
      password: "123",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UploadLoginFormValues) => {
      if (values.username !== "user" || values.password !== "123") {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng.");
      }

      return { success: true };
    },
    onSuccess: () => {
      setUploadUserAuthenticated(true);
      onAuthenticated();
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 min-w-3xl">
        <div className="grid md:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel border-x-0 border-y-0 border-r border-r-white/70 bg-[linear-gradient(180deg,rgba(23,130,97,0.14),rgba(255,255,255,0.92))] p-7">
            <div className="eyebrow">Xác thực người dùng</div>
            <DialogHeader className="mt-4">
              <DialogTitle className="section-title">
                Đăng nhập tải lên
              </DialogTitle>
              <DialogDescription className="text-sm leading-7">
                Vui lòng đăng nhập trước khi gửi xuất bản phẩm lên hệ thống.
                Phiên đăng nhập này chỉ áp dụng cho chức năng tải lên.
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
                      Tải lên có kiểm soát
                    </div>
                    <p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">
                      Mọi tệp gửi lên đều được ghi nhận lịch sử và chuyển trạng
                      thái chờ quản trị viên duyệt.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-sm border border-[var(--border)] bg-white/82 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--card-soft)] text-[var(--accent)]">
                    <CircleUserRound className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-heading text-sm font-semibold">
                      Tài khoản mặc định
                    </div>
                    <div className="mt-2 grid gap-1 text-sm text-[var(--muted-foreground)]">
                      <div>
                        Tên đăng nhập:{" "}
                        <strong className="text-[var(--foreground)]">
                          user
                        </strong>
                      </div>
                      <div>
                        Mật khẩu:{" "}
                        <strong className="text-[var(--foreground)]">
                          123
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
                <Label htmlFor="upload-username">Tên đăng nhập</Label>
                <Input id="upload-username" {...form.register("username")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="upload-password">Mật khẩu</Label>
                <Input
                  id="upload-password"
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
                  {mutation.isPending
                    ? "Đang xác thực..."
                    : "Vào trang tải lên"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
