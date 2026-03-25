import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReviewDialog } from '@/components/admin/review-dialog';

describe('ReviewDialog', () => {
  it('chỉ cho phép xác nhận khi có ghi chú xử lý', async () => {
    const user = userEvent.setup();

    render(
      <ReviewDialog
        action="publish"
        open
        onOpenChange={() => undefined}
        onConfirm={async () => undefined}
      />,
    );

    const button = screen.getByRole('button', { name: 'Xác nhận phát hành' });
    expect(button).toBeDisabled();

    await user.type(
      screen.getByLabelText('Ghi chú xử lý'),
      'Đủ điều kiện phát hành',
    );

    expect(button).toBeEnabled();
  });
});
