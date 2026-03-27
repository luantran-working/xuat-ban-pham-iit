import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactPage } from '@/pages/contact-page';

function renderContactPage() {
  return render(
    <MemoryRouter>
      <ContactPage />
    </MemoryRouter>,
  );
}

describe('ContactPage', () => {
  it('căn giữa phần mô tả CTA cuối trang', () => {
    renderContactPage();

    const ctaIntro = screen.getByText(
      'Đội ngũ IIT luôn sẵn sàng hỗ trợ bạn trong quá trình sử dụng hệ thống phát hành phẩm điện tử.',
    );

    expect(ctaIntro.className).toContain('text-center');
    expect(ctaIntro.parentElement?.className).toContain('justify-center');
  });
});
