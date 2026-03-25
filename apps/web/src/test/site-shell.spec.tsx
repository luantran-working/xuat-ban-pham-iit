import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SiteShell } from '@/components/site-shell';

vi.mock('@/lib/api', () => ({
  adminLogin: vi.fn(),
}));

function renderSiteShell() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <MemoryRouter initialEntries={['/']}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route element={<SiteShell />}>
            <Route index element={<div>Trang chủ</div>} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('SiteShell', () => {
  it('mở dialog đăng nhập quản trị từ header', async () => {
    const user = userEvent.setup();

    renderSiteShell();

    await user.click(screen.getAllByRole('button', { name: /quản trị/i })[0]);

    expect(await screen.findByRole('heading', { name: 'Đăng nhập quản trị' })).toBeInTheDocument();
    expect(screen.getByLabelText('Tên đăng nhập')).toBeInTheDocument();
    expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument();
  });
});
