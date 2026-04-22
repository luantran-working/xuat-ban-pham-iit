import { type ReactNode, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  CloudUpload,
  FileText,
  HelpCircle,
  Info,
  Shield,
  UploadCloud,
} from "lucide-react";
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
    .min(1, "Vui lòng nhập năm phát hành.")
    .refine((value) => {
      const numericValue = Number(value);
      return numericValue >= 1900 && numericValue <= 2100;
    }, "Năm phát hành không hợp lệ."),
  copyrightExpiryDate: z
    .string()
    .min(1, "Vui lòng chọn ngày hết hạn bản quyền."),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

const supportedFormats = [
  { label: "PDF", description: "Tài liệu, sách, báo cáo" },
  { label: "Hình ảnh", description: "PNG, JPG, SVG, WebP" },
  { label: "Video", description: "MP4, WebM, MOV" },
  { label: "Audio", description: "MP3, WAV, OGG" },
];

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
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

      return uploadPublication(formData, (progress) => {
        const percent = progress.totalBytes
          ? Math.round((progress.uploadedBytes / progress.totalBytes) * 100)
          : 0;
        setUploadProgress(percent);
      });
    },
    onSuccess: (result) => {
      setUploadedStatus(result.status);
      form.reset();
      setFiles([]);
      setUploadProgress(100);
    },
    onError: () => {
      setUploadProgress(0);
    },
  });

  function handleUploadDialogChange(open: boolean) {
    if (!open && !isUploadAuthenticated) {
      navigate("/", { replace: true });
      return;
    }
    setIsLoginDialogOpen(open);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) setFiles((prev) => [...prev, ...droppedFiles]);
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
        <div>
          {/* ===== HERO ===== */}
          <section className="gradient-hero">
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
              <div className="reveal text-center space-y-4">
                <div className="eyebrow">Tải lên phát hành phẩm</div>
                <h1 className="section-title mx-auto max-w-2xl">
                  Gửi tài liệu mới để được đọc duyệt và phát hành
                </h1>
                <p className="body-text mx-auto max-w-xl">
                  Điền thông tin bên dưới và đính kèm tệp tài liệu. Phát hành
                  phẩm sẽ được chuyển sang chờ duyệt ngay khi gửi thành công.
                </p>
              </div>
            </div>
          </section>

          {/* ===== MAIN CONTENT ===== */}
          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                {/* Upload Form */}
                <Card className="reveal">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
                        <CloudUpload className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>Thông tin phát hành phẩm</CardTitle>
                        <CardDescription>
                          Cung cấp metadata và tệp đính kèm.
                        </CardDescription>
                      </div>
                    </div>
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
                        <Input
                          id="title"
                          placeholder="Nhập tiêu đề phát hành phẩm..."
                          {...form.register("title")}
                        />
                        <FieldError
                          message={form.formState.errors.title?.message}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Mô tả ngắn</Label>
                        <Textarea
                          id="description"
                          placeholder="Mô tả nội dung chính của phát hành phẩm..."
                          {...form.register("description")}
                        />
                        <FieldError
                          message={form.formState.errors.description?.message}
                        />
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="author">Tác giả / Đơn vị gửi</Label>
                          <Input
                            id="author"
                            placeholder="Tên tác giả hoặc đơn vị..."
                            {...form.register("author")}
                          />
                          <FieldError
                            message={form.formState.errors.author?.message}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="publishYear">Năm phát hành</Label>
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
                          message={
                            form.formState.errors.copyrightExpiryDate?.message
                          }
                        />
                      </div>

                      {/* Drag & Drop Zone */}
                      <div className="grid gap-2">
                        <Label>Tệp đính kèm</Label>
                        <div
                          className={[
                            "relative flex flex-col items-center justify-center rounded-[var(--radius)] border-2 border-dashed p-8 text-center transition-all cursor-pointer",
                            isDragOver
                              ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                              : "border-[var(--border-strong)] bg-[var(--primary-50)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]",
                          ].join(" ")}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragOver(true);
                          }}
                          onDragLeave={() => setIsDragOver(false)}
                          onDrop={handleDrop}
                          onClick={() =>
                            document.getElementById("files")?.click()
                          }
                        >
                          <UploadCloud className="mb-3 h-10 w-10 text-[var(--primary-300)]" />
                          <div className="text-sm font-medium text-[var(--foreground)]">
                            Kéo thả tệp vào đây hoặc nhấn để chọn
                          </div>
                          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            PDF, hình ảnh, video, audio và các định dạng khác
                          </p>
                          <input
                            id="files"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(event) =>
                              setFiles(Array.from(event.target.files ?? []))
                            }
                          />
                        </div>
                        {files.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {files.map((file, idx) => (
                              <div
                                key={`${file.name}-${idx}`}
                                className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--primary-50)] px-3 py-2 text-sm"
                              >
                                <FileText className="h-4 w-4 text-[var(--accent)]" />
                                <span className="truncate text-[var(--foreground)]">
                                  {file.name}
                                </span>
                                <span className="ml-auto shrink-0 text-xs text-[var(--muted-foreground)]">
                                  {(file.size / 1024).toFixed(0)} KB
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {mutation.error ? (
                        <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                          <Info className="mt-0.5 h-4 w-4 shrink-0" />
                          {(mutation.error as Error).message}
                        </div>
                      ) : null}

                      {mutation.isPending ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
                            <span>Tiến độ tải lên</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[var(--primary-100)]">
                            <div
                              className="h-full bg-[var(--accent)] transition-all"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : null}

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={mutation.isPending}
                      >
                        <UploadCloud className="h-4 w-4" />
                        <span className="text-white">
                          {mutation.isPending
                            ? "Đang tải lên..."
                            : "Gửi phát hành xuất bản phẩm điện tử"}
                        </span>
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Right Sidebar */}
                <div className="reveal reveal-delay-1 space-y-6">
                  {/* Process Steps */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
                          <Shield className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            Quy trình xử lý
                          </CardTitle>
                          <CardDescription>
                            Sau tải lên, quản trị viên sẽ kiểm tra.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Step number="1" title="Tiếp nhận hồ sơ">
                        Metadata và tệp được lưu lại ngay khi gửi thành công.
                      </Step>
                      <Step number="2" title="Hàng chờ duyệt">
                        Trạng thái mặc định là <strong>Đang chờ duyệt</strong>.
                      </Step>
                      <Step number="3" title="Đọc duyệt">
                        Quản trị viên xử lý: phát hành hoặc tạm ngưng.
                      </Step>
                      {uploadedStatus ? (
                        <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-emerald-200 bg-emerald-50 p-4">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                          <div>
                            <div className="text-sm font-semibold text-emerald-800">
                              Tải lên thành công!
                            </div>
                            <div className="mt-2">
                              <StatusBadge status={uploadedStatus} />
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>

                  {/* Supported Formats */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base">
                          Định dạng hỗ trợ
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {supportedFormats.map((fmt) => (
                          <div
                            key={fmt.label}
                            className="rounded-[var(--radius-sm)] bg-[var(--primary-50)] p-3"
                          >
                            <div className="text-sm font-semibold text-[var(--foreground)]">
                              {fmt.label}
                            </div>
                            <div className="mt-1 text-xs text-[var(--muted-foreground)]">
                              {fmt.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-rose-600">{message}</p>;
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
    <div className="flex gap-4 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--primary-50)] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] text-sm font-bold text-white shadow-sm">
        {number}
      </div>
      <div>
        <div className="font-heading text-sm font-semibold text-[var(--foreground)]">
          {title}
        </div>
        <div className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {children}
        </div>
      </div>
    </div>
  );
}
