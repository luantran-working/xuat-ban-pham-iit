import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilePreview } from "@/components/file-preview";
import type { PublicationDetail } from "@/types/publication";

type PublicationPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publication: PublicationDetail | null;
};

export function PublicationPreviewDialog({
  open,
  onOpenChange,
  publication,
}: PublicationPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-w-5xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Preview phát hành phẩm</DialogTitle>
          <DialogDescription>
            {publication
              ? `Đang xem tệp đính kèm của: ${publication.title}`
              : "Chọn một phát hành phẩm trong bảng để xem trước."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-2">
          {publication?.files.length ? (
            publication.files.map((file) => (
              <FilePreview key={file.id} file={file} />
            ))
          ) : (
            <div className="rounded-sm border border-dashed border-[var(--border-strong)] p-8 text-center text-[var(--muted-foreground)]">
              Phát hành phẩm này chưa có tệp đính kèm để preview.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
