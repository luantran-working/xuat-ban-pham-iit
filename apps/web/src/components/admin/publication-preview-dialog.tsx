import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { resolveApiUrl } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilePreview } from "@/components/file-preview";
import type {
  PublicationDetail,
  PublicationFileItem,
} from "@/types/publication";

type PublicationPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publication: PublicationDetail | null;
  adminToken: string;
};

export function PublicationPreviewDialog({
  open,
  onOpenChange,
  publication,
  adminToken,
}: PublicationPreviewDialogProps) {
  const [previewFiles, setPreviewFiles] = useState<PublicationFileItem[]>([]);
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepareError, setPrepareError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !publication) {
      setPreviewFiles([]);
      setIsPreparing(false);
      setPrepareError(null);
      return;
    }

    const selectedPublication = publication;

    let isMounted = true;
    const objectUrls: string[] = [];

    async function hydratePreviewFiles() {
      setIsPreparing(true);
      setPrepareError(null);

      try {
        const files = await Promise.all(
          selectedPublication.files.map(async (file) => {
            const response = await fetch(resolveApiUrl(file.previewUrl), {
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            });

            if (!response.ok) {
              throw new Error(
                `Không thể tải tệp ${file.originalName} để preview (mã ${response.status}).`,
              );
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            objectUrls.push(objectUrl);

            return {
              ...file,
              previewUrl: objectUrl,
              downloadUrl: objectUrl,
            };
          }),
        );

        if (isMounted) {
          setPreviewFiles(files);
        }
      } catch (error) {
        if (isMounted) {
          setPreviewFiles([]);
          setPrepareError((error as Error).message);
        }
      } finally {
        if (isMounted) {
          setIsPreparing(false);
        }
      }
    }

    hydratePreviewFiles();

    return () => {
      isMounted = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [adminToken, open, publication?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Preview xuất bản phẩm</DialogTitle>
          <DialogDescription>
            {publication
              ? `Đang xem tệp đính kèm của: ${publication.title}`
              : "Chọn một xuất bản phẩm trong bảng để xem trước."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-2">
          {isPreparing ? (
            <div className="flex min-h-40 items-center justify-center gap-3 rounded-sm border border-dashed border-[var(--border-strong)] p-6 text-[var(--muted-foreground)]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Đang tải tệp để preview...
            </div>
          ) : prepareError ? (
            <div className="rounded-sm border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
              {prepareError}
            </div>
          ) : previewFiles.length ? (
            previewFiles.map((file) => (
              <FilePreview key={file.id} file={file} />
            ))
          ) : (
            <div className="rounded-sm border border-dashed border-[var(--border-strong)] p-8 text-center text-[var(--muted-foreground)]">
              Xuất bản phẩm này chưa có tệp đính kèm để preview.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
