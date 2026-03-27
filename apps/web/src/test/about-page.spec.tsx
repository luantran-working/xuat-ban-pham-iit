import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from '@/pages/about-page';

function renderAboutPage() {
  return render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  );
}

describe('AboutPage', () => {
  it('căn giữa phần giới thiệu giá trị cốt lõi và CTA', () => {
    renderAboutPage();

    const coreValuesIntro = screen.getByText(
      'Bốn giá trị nền tảng định hình cách hệ thống tiếp nhận, xử lý và công bố phát hành phẩm.',
    );
    const ctaIntro = screen.getByText(
      'Tải lên phát hành phẩm mới hoặc liên hệ với IIT để được hỗ trợ thêm.',
    );

    expect(coreValuesIntro.className).toContain('text-center');
    expect(coreValuesIntro.parentElement?.className).toContain('justify-center');
    expect(ctaIntro.className).toContain('text-center');
    expect(ctaIntro.parentElement?.className).toContain('justify-center');
  });
});
