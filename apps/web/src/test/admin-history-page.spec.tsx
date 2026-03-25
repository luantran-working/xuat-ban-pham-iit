import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AdminHistoryPage } from '@/pages/admin-history-page';
import { fetchAdminPublications } from '@/lib/api';
import { getAdminToken } from '@/lib/auth';

vi.mock('@/lib/api', () => ({
  fetchAdminPublications: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  getAdminToken: vi.fn(),
  clearAdminToken: vi.fn(),
}));

function renderAdminHistoryPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AdminHistoryPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('AdminHistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAdminToken).mockReturnValue('demo-token');
    vi.mocked(fetchAdminPublications).mockResolvedValue({
      items: [
        {
          id: 'pb-1',
          title: 'Kỷ yếu nghiên cứu IIT',
          description: 'Ấn phẩm kiểm duyệt',
          author: 'Công ty Cổ phần IIT',
          publishYear: 2025,
          copyrightExpiryDate: '2027-12-31',
          status: 'PUBLISHED',
          isLocked: false,
          createdAt: new Date('2026-03-24T09:00:00.000Z').toISOString(),
          updatedAt: new Date('2026-03-24T09:00:00.000Z').toISOString(),
          files: [],
          history: [
            {
              id: 'h-1',
              action: 'UPLOAD',
              actor: 'Người dùng công khai',
              note: 'Khởi tạo hồ sơ xuất bản phẩm',
              previousStatus: null,
              nextStatus: 'PENDING',
              createdAt: new Date('2026-03-24T08:00:00.000Z').toISOString(),
            },
            {
              id: 'h-2',
              action: 'PUBLISH',
              actor: 'admin',
              note: 'Đủ điều kiện phát hành',
              previousStatus: 'PENDING',
              nextStatus: 'PUBLISHED',
              createdAt: new Date('2026-03-25T08:00:00.000Z').toISOString(),
            },
          ],
        },
      ],
    });
  });

  it('hiển thị riêng danh sách lịch sử ghi nhận của xuất bản phẩm', async () => {
    renderAdminHistoryPage();

    expect(await screen.findByText('Lịch sử ghi nhận')).toBeInTheDocument();
    expect(await screen.findByText('Đủ điều kiện phát hành')).toBeInTheDocument();
    expect(screen.getByText('Khởi tạo hồ sơ xuất bản phẩm')).toBeInTheDocument();
    expect(screen.getAllByText('Kỷ yếu nghiên cứu IIT')).toHaveLength(2);
  });
});
