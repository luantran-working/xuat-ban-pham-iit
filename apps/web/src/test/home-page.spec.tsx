import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '@/pages/home-page';
import { fetchPublications } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  fetchPublications: vi.fn(),
}));

function renderHomePage() {
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
        <HomePage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchPublications).mockResolvedValue({
      items: [
        {
          id: 'pb-1',
          title: 'Kỷ yếu nghiên cứu IIT',
          author: 'Công ty Cổ phần IIT',
          description: 'Ấn phẩm đã phát hành',
          publishYear: 2025,
          status: 'PUBLISHED',
          isLocked: false,
          fileCount: 2,
          createdAt: new Date('2026-03-24T09:00:00.000Z').toISOString(),
        },
        {
          id: 'pb-2',
          title: 'Bản ghi ngưng phát hành',
          author: 'Phòng Pháp chế',
          description: 'Ấn phẩm tạm ngưng',
          publishYear: 2024,
          status: 'SUSPENDED',
          isLocked: true,
          fileCount: 1,
          createdAt: new Date('2026-03-23T09:00:00.000Z').toISOString(),
        },
      ],
    });
  });

  it('lọc danh sách theo trạng thái công khai được chọn', async () => {
    const user = userEvent.setup();

    renderHomePage();

    expect(await screen.findByText('Kỷ yếu nghiên cứu IIT')).toBeInTheDocument();
    expect(screen.getByText('Bản ghi ngưng phát hành')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tạm ngưng' }));

    await waitFor(() => {
      expect(screen.queryByText('Kỷ yếu nghiên cứu IIT')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Bản ghi ngưng phát hành')).toBeInTheDocument();
  });
});
