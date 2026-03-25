export enum PublicationStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  SUSPENDED = 'SUSPENDED',
}

const allowedTransitions: Record<PublicationStatus, PublicationStatus[]> = {
  [PublicationStatus.PENDING]: [
    PublicationStatus.PUBLISHED,
    PublicationStatus.SUSPENDED,
  ],
  [PublicationStatus.PUBLISHED]: [PublicationStatus.SUSPENDED],
  [PublicationStatus.SUSPENDED]: [PublicationStatus.PUBLISHED],
};

export function transitionPublicationStatus(
  currentStatus: PublicationStatus,
  nextStatus: PublicationStatus,
) {
  if (currentStatus === nextStatus) {
    throw new Error('Trạng thái đích phải khác trạng thái hiện tại');
  }

  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    throw new Error('Không thể chuyển trạng thái theo quy trình hiện tại');
  }

  return nextStatus;
}
