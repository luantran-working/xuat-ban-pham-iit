import { FileText, Image as ImageIcon, Music2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize } from "@/lib/utils";
import { resolveApiUrl } from "@/lib/api";
import type { PublicationFileItem } from "@/types/publication";

const OFFICE_EXTENSIONS = new Set([
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "csv",
]);

export function FilePreview({ file }: { file: PublicationFileItem }) {
  const previewUrl = resolveApiUrl(file.previewUrl);
  const downloadUrl = resolveApiUrl(file.downloadUrl);
  const canPreviewOfficeFile = OFFICE_EXTENSIONS.has(
    file.extension.toLowerCase(),
  );
  const officePreviewUrl =
    canPreviewOfficeFile && file.previewType === "file"
      ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(previewUrl)}`
      : null;
  const googlePreviewUrl =
    canPreviewOfficeFile && file.previewType === "file"
      ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(previewUrl)}`
      : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg">{file.originalName}</CardTitle>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {file.mimeType} · {formatFileSize(file.size)}
          </p>
        </div>
        <a href={downloadUrl} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm">
            Tải tệp
          </Button>
        </a>
      </CardHeader>
      <CardContent>
        {file.previewType === "pdf" && (
          <iframe
            src={previewUrl}
            title={file.originalName}
            className="h-[420px] w-full rounded-sm border border-[var(--border)]"
          />
        )}
        {file.previewType === "image" && (
          <img
            src={previewUrl}
            alt={file.originalName}
            className="max-h-[420px] w-full rounded-sm border border-[var(--border)] object-contain bg-white"
          />
        )}
        {file.previewType === "video" && (
          <video
            controls
            className="max-h-[420px] w-full rounded-sm border border-[var(--border)] bg-slate-950"
            src={previewUrl}
          />
        )}
        {file.previewType === "audio" && (
          <div className="rounded-sm border border-[var(--border)] bg-white p-6">
            <div className="mb-4 flex items-center gap-3 text-lg font-medium">
              <Music2 className="h-5 w-5 text-[var(--accent)]" />
              Tệp âm thanh
            </div>
            <audio controls className="w-full" src={previewUrl} />
          </div>
        )}
        {file.previewType === "file" && (
          <div className="space-y-4">
            {canPreviewOfficeFile ? (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-sm border border-[var(--border)] bg-white">
                  <iframe
                    src={officePreviewUrl ?? undefined}
                    title={`Preview ${file.originalName}`}
                    className="h-[520px] w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={officePreviewUrl ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button type="button" variant="outline" size="sm">
                      Mở bằng Microsoft Viewer
                    </Button>
                  </a>
                  <a
                    href={googlePreviewUrl ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button type="button" variant="outline" size="sm">
                      Mở bằng Google Viewer
                    </Button>
                  </a>
                </div>
              </div>
            ) : null}

            <div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-[var(--border-strong)] bg-[var(--card-soft)] p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-white text-[var(--accent)]">
                {file.mimeType.startsWith("image/") ? (
                  <ImageIcon className="h-6 w-6" />
                ) : file.mimeType.startsWith("video/") ? (
                  <PlayCircle className="h-6 w-6" />
                ) : (
                  <FileText className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="font-medium">{file.originalName}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {canPreviewOfficeFile
                    ? "Nếu khung xem không tải được, hãy dùng nút Microsoft/Google Viewer hoặc tải xuống để xem đầy đủ."
                    : "Loại tệp này chưa có preview trực tiếp, vui lòng tải xuống để xem."}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
