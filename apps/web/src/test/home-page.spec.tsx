import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "@/pages/home-page";
import { fetchPublications } from "@/lib/api";

vi.mock("@/lib/api", () => ({
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

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchPublications).mockResolvedValue({
      items: [
        {
          id: "pb-1",
          title: "Kỷ yếu nghiên cứu IIT",
          author: "Công ty Cổ phần IIT",
          description: "Ấn phẩm đã phát hành",
          publishYear: 2025,
          status: "PUBLISHED",
          isLocked: false,
          fileCount: 2,
          createdAt: new Date("2026-03-24T09:00:00.000Z").toISOString(),
        },
        {
          id: "pb-2",
          title: "Bản ghi ngưng phát hành",
          author: "Phòng Pháp chế",
          description: "Ấn phẩm tạm ngưng",
          publishYear: 2024,
          status: "SUSPENDED",
          isLocked: true,
          fileCount: 1,
          createdAt: new Date("2026-03-23T09:00:00.000Z").toISOString(),
        },
      ],
    });
  });

  it("hiển thị thuật ngữ mới trên trang chủ", async () => {
    renderHomePage();

    expect(
      await screen.findByText("Giải pháp toàn diện cho phát hành số"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Từ tiếp nhận hồ sơ, đọc duyệt nội dung đến phát hành công khai – tất cả trong một hệ thống duy nhất.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Dữ liệu số")).toBeInTheDocument();
    expect(
      screen.getByText("Sẵn sàng gửi phát hành phẩm?"),
    ).toBeInTheDocument();
  });

  it("căn giữa nội dung giới thiệu và dùng màu chữ tương phản cho các nút CTA", async () => {
    renderHomePage();

    const featureIntro = await screen.findByText(
      "Từ tiếp nhận hồ sơ, đọc duyệt nội dung đến phát hành công khai – tất cả trong một hệ thống duy nhất.",
    );
    const processIntro = screen.getByText(
      "Quy trình được chuẩn hóa giúp đảm bảo tính minh bạch và kiểm soát chất lượng nội dung.",
    );
    const ctaIntro = screen.getByText(
      "Bắt đầu quy trình tiếp nhận và đọc duyệt ngay hôm nay. Hệ thống hỗ trợ nhiều định dạng tệp và xử lý nhanh chóng.",
    );
    const uploadNowLink = screen.getByRole("link", { name: "Tải lên ngay" });
    const supportLink = screen.getByRole("link", { name: "Liên hệ hỗ trợ" });

    expect(featureIntro.className).toContain("text-center");
    expect(featureIntro.parentElement?.className).toContain("justify-center");
    expect(processIntro.className).toContain("text-center");
    expect(processIntro.parentElement?.className).toContain("justify-center");
    expect(ctaIntro.className).toContain("text-center");
    expect(ctaIntro.parentElement?.className).toContain("justify-center");
    expect(uploadNowLink.className).toContain("!text-[var(--primary-700)]");
    expect(supportLink.className).toContain("!text-white");
  });

  it("lọc danh mục theo trạng thái công khai được chọn", async () => {
    const user = userEvent.setup();

    renderHomePage();

    expect(
      await screen.findByText("Kỷ yếu nghiên cứu IIT"),
    ).toBeInTheDocument();
    expect(screen.getByText("Bản ghi ngưng phát hành")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tạm ngưng" }));

    await waitFor(() => {
      expect(
        screen.queryByText("Kỷ yếu nghiên cứu IIT"),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText("Bản ghi ngưng phát hành")).toBeInTheDocument();
  });
});
