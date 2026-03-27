import { PrismaClient, PublicationHistoryAction, PublicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.publicationHistory.deleteMany();
  await prisma.publicationFile.deleteMany();
  await prisma.publication.deleteMany();

  const publication = await prisma.publication.create({
    data: {
      title: 'Kỷ yếu khoa học IIT năm 2026',
      description: 'Tập hợp các công trình nghiên cứu tiêu biểu của IIT.',
      author: 'Viện Công nghệ IIT',
      publishYear: 2026,
      copyrightExpiryDate: new Date('2030-12-31'),
      status: PublicationStatus.PUBLISHED,
      files: {
        create: [
          {
            originalName: 'ky-yeu-iit-2026.pdf',
            storedName: 'ky-yeu-iit-2026.pdf',
            mimeType: 'application/pdf',
            extension: 'pdf',
            size: 0,
            relativePath: 'sample/ky-yeu-iit-2026.pdf',
          },
        ],
      },
      histories: {
        create: [
          {
            action: PublicationHistoryAction.UPLOAD,
            actor: 'Người dùng công khai',
            note: 'Tải lên phát hành phẩm mới.',
            nextStatus: PublicationStatus.PENDING,
          },
          {
            action: PublicationHistoryAction.PUBLISH,
            actor: 'admin',
            note: 'Đủ điều kiện phát hành.',
            previousStatus: PublicationStatus.PENDING,
            nextStatus: PublicationStatus.PUBLISHED,
          },
        ],
      },
    },
  });

  console.log(`Đã seed dữ liệu mẫu: ${publication.title}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
