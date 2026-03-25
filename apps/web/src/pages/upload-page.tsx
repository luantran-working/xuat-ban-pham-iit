import { type ReactNode, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadPublication } from "@/lib/api";
import { getUploadUserAuthenticated } from "@/lib/auth";
import { UploadLoginDialog } from "@/components/upload-login-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";
import type { PublicationStatus } from "@/types/publication";

const uploadSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề."),
  description: z.string().min(1, "Vui lòng nhập mô tả ngắn."),
  author: z.string().min(1, "Vui lòng nhập tác giả hoặc đơn vị gửi."),
  publishYear: z
    .string()
    .min(1, "Vui lòng nhập năm xuất bản.")
    .refine((value) => {
      const numericValue = Number(value);
      return numericValue >= 1900 && numericValue <= 2100;
    }, "Năm xuất bản không hợp lệ."),
  copyrightExpiryDate: z
    .string()
    .min(1, "Vui lòng chọn ngày hết hạn bản quyền."),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedStatus, setUploadedStatus] =
    useState<PublicationStatus | null>(null);
  const [isUploadAuthenticated, setIsUploadAuthenticated] = useState(() =>
    getUploadUserAuthenticated(),
  );
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(
    () => !getUploadUserAuthenticated(),
  );

  useEffect(() => {
    if (!isUploadAuthenticated) {
      setIsLoginDialogOpen(true);
    }
  }, [isUploadAuthenticated]);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      publishYear: String(new Date().getFullYear()),
      copyrightExpiryDate: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UploadFormValues) => {
      if (!files.length) {
        throw new Error("Vui lòng chọn ít nhất một tệp đính kèm.");
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("author", values.author);
      formData.append("publishYear", values.publishYear);
      formData.append("copyrightExpiryDate", values.copyrightExpiryDate);
      files.forEach((file) => formData.append("files", file));

      return uploadPublication(formData);
    },
    onSuccess: (result) => {
      setUploadedStatus(result.status);
      form.reset();
      setFiles([]);
    },
  });

  function handleUploadDialogChange(open: boolean) {
    if (!open && !isUploadAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    setIsLoginDialogOpen(open);
  }

  return (
    <>
      <UploadLoginDialog
        open={isLoginDialogOpen}
        onOpenChange={handleUploadDialogChange}
        onAuthenticated={() => {
          setIsUploadAuthenticated(true);
          setIsLoginDialogOpen(false);
        }}
      />

      {isUploadAuthenticated ? (
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1fr_0.85fr] md:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="section-title">
                Tải lên xuất bản phẩm mới
              </CardTitle>
              <CardDescription>
                Người dùng công khai có thể gửi nhiều tệp cùng lúc. Sau khi tiếp
                nhận, hệ thống sẽ chuyển trạng thái sang Đang chờ duyệt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-5"
                onSubmit={form.handleSubmit((values: UploadFormValues) =>
                  mutation.mutate(values),
                )}
              >
                <div className="grid gap-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input id="title" {...form.register("title")} />
                  <FieldError message={form.formState.errors.title?.message} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Mô tả ngắn</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                  />
                  <FieldError
                    message={form.formState.errors.description?.message}
                  />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="author">Tác giả/đơn vị gửi</Label>
                    <Input id="author" {...form.register("author")} />
                    <FieldError
                      message={form.formState.errors.author?.message}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="publishYear">Năm xuất bản</Label>
                    <Input
                      id="publishYear"
                      type="number"
                      {...form.register("publishYear")}
                    />
                    <FieldError
                      message={form.formState.errors.publishYear?.message}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="copyrightExpiryDate">
                    Ngày hết hạn bản quyền
                  </Label>
                  <Input
                    id="copyrightExpiryDate"
                    type="date"
                    {...form.register("copyrightExpiryDate")}
                  />
                  <FieldError
                    message={form.formState.errors.copyrightExpiryDate?.message}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="files">Tệp đính kèm</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    onChange={(event) =>
                      setFiles(Array.from(event.target.files ?? []))
                    }
                  />
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Cho phép PDF, hình ảnh, video, audio và các tệp phổ biến
                    khác.
                  </p>
                </div>
                {mutation.error ? (
                  <div className="rounded-sm border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {(mutation.error as Error).message}
                  </div>
                ) : null}
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={mutation.isPending}
                >
                  <UploadCloud className="h-4 w-4" />
                  {mutation.isPending ? "Đang tải lên..." : "Gửi xuất bản phẩm"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="section-title">
                Tóm tắt quy trình xử lý
              </CardTitle>
              <CardDescription>
                Sau khi tải lên, quản trị viên sẽ kiểm tra tính hợp lệ và thời
                hạn bản quyền.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Step number="1" title="Tiếp nhận hồ sơ">
                Metadata và tệp được lưu lại ngay khi bạn gửi thành công.
              </Step>
              <Step number="2" title="Đưa vào hàng chờ duyệt">
                Trạng thái mặc định là <strong>Đang chờ duyệt</strong>.
              </Step>
              <Step number="3" title="Xử lý bởi quản trị viên">
                Nếu hợp lệ, bản ghi sẽ được phát hành. Nếu phát hiện vi phạm
                hoặc hết hạn bản quyền, bản ghi sẽ bị tạm ngưng.
              </Step>
              {uploadedStatus ? (
                <div className="rounded-sm border border-sky-200 bg-sky-50 p-5">
                  <div className="mb-3 text-sm font-medium text-sky-800">
                    Tải lên thành công
                  </div>
                  <StatusBadge status={uploadedStatus} />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-rose-700">{message}</p>;
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--card-soft)] p-5">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[var(--accent)] text-sm font-semibold text-white">
          {number}
        </div>
        <div className="font-medium">{title}</div>
      </div>
      <div className="text-sm leading-7 text-[var(--muted-foreground)]">
        {children}
      </div>
    </div>
  );
}
