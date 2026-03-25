import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PublicationCard } from '@/components/publication-card';

describe('PublicationCard', () => {
  it('hiển thị trạng thái tạm ngưng và lớp khóa nội dung', () => {
    render(
      <MemoryRouter>
        <PublicationCard
          publication={{
            id: 'pb-1',
            title: 'Kỷ yếu nghiên cứu IIT',
            author: 'Viện Công nghệ IIT',
            description: 'Ấn phẩm minh họa',
            publishYear: 2026,
            status: 'SUSPENDED',
            isLocked: true,
            fileCount: 2,
            createdAt: new Date().toISOString(),
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Tạm ngưng')).toBeInTheDocument();
    expect(screen.getByText('Nội dung không còn khả dụng')).toBeInTheDocument();
  });
});
