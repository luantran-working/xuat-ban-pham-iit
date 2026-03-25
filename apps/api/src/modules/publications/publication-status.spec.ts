import {
  PublicationStatus,
  transitionPublicationStatus,
} from './publication-status';

describe('transitionPublicationStatus', () => {
  it('cho phép phát hành bản ghi đang chờ duyệt', () => {
    expect(
      transitionPublicationStatus(
        PublicationStatus.PENDING,
        PublicationStatus.PUBLISHED,
      ),
    ).toBe(PublicationStatus.PUBLISHED);
  });

  it('cho phép gỡ bỏ mềm bản ghi đã phát hành', () => {
    expect(
      transitionPublicationStatus(
        PublicationStatus.PUBLISHED,
        PublicationStatus.SUSPENDED,
      ),
    ).toBe(PublicationStatus.SUSPENDED);
  });

  it('không cho phép chuyển sang chính trạng thái hiện tại', () => {
    expect(() =>
      transitionPublicationStatus(
        PublicationStatus.SUSPENDED,
        PublicationStatus.SUSPENDED,
      ),
    ).toThrow('Trạng thái đích phải khác trạng thái hiện tại');
  });
});
