import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithTag');
jest.mock('./isParentBindingMetadata');

import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';
import { isParentBindingMetadata } from './isParentBindingMetadata';
import { isParentBindingMetadataWithTag } from './isParentBindingMetadataWithTag';

describe(isParentBindingMetadataWithTag.name, () => {
  let tagFixture: MetadataTag;
  let tagValueFixture: unknown;

  beforeAll(() => {
    tagFixture = 'name-fixture';
    tagValueFixture = Symbol();
  });

  describe('when called', () => {
    let isBindingMetadataWithNameResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;
    let isParentBindingMetadataResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingMetadataWithNameResultMock = jest.fn();
      isParentBindingMetadataResultMock = jest.fn();

      (
        isBindingMetadataWithTag as jest.Mock<typeof isBindingMetadataWithTag>
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isParentBindingMetadata as jest.Mock<typeof isParentBindingMetadata>
      ).mockReturnValueOnce(isParentBindingMetadataResultMock);

      result = isParentBindingMetadataWithTag(tagFixture, tagValueFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingMetadataWithTag()', () => {
      expect(isBindingMetadataWithTag).toHaveBeenCalledTimes(1);
      expect(isBindingMetadataWithTag).toHaveBeenCalledWith(
        tagFixture,
        tagValueFixture,
      );
    });

    it('should call isParentBindingMetadata()', () => {
      expect(isParentBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isParentBindingMetadata).toHaveBeenCalledWith(
        isBindingMetadataWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isParentBindingMetadataResultMock);
    });
  });
});
