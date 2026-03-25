import { useMemo, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ReviewDialogProps = {
  action: 'publish' | 'suspend';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (note: string) => Promise<void>;
};

export function ReviewDialog({
  action,
  open,
  onOpenChange,
  onConfirm,
}: ReviewDialogProps) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = useMemo(
    () =>
      action === 'publish'
        ? {
            title: 'Xác nhận phát hành',
            description:
              'Bản ghi sẽ được chuyển sang trạng thái công khai và có thể xem trực tiếp.',
            buttonLabel: 'Xác nhận phát hành',
          }
        : {
            title: 'Xác nhận gỡ bỏ mềm',
            description:
              'Bản ghi sẽ chuyển sang trạng thái tạm ngưng và không còn xem được nội dung.',
            buttonLabel: 'Xác nhận tạm ngưng',
          },
    [action],
  );

  async function handleConfirm() {
    if (!note.trim()) return;
    setIsSubmitting(true);
    try {
      await onConfirm(note.trim());
      setNote('');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-3">
          <Label htmlFor="review-note">Ghi chú xử lý</Label>
          <Textarea
            id="review-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Nhập ghi chú bắt buộc để lưu vào lịch sử thao tác..."
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button disabled={!note.trim() || isSubmitting} onClick={handleConfirm}>
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {config.buttonLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
