import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithTag');
jest.mock('./isNotParentBindingMetadata');

import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';
import { isNotParentBindingMetadata } from './isNotParentBindingMetadata';
import { isNotParentBindingMetadataWithTag } from './isNotParentBindingMetadataWithTag';

describe(isNotParentBindingMetadataWithTag.name, () => {
  let tagFixture: MetadataTag;
  let tagValueFixture: unknown;

  beforeAll(() => {
    tagFixture = 'tag-fixture';
    tagValueFixture = Symbol();
  });

  describe('when called', () => {
    let isBindingMetadataWithNameResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;
    let isNotParentBindingMetadataResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingMetadataWithNameResultMock = jest.fn();
      isNotParentBindingMetadataResultMock = jest.fn();

      (
        isBindingMetadataWithTag as jest.Mock<typeof isBindingMetadataWithTag>
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isNotParentBindingMetadata as jest.Mock<
          typeof isNotParentBindingMetadata
        >
      ).mockReturnValueOnce(isNotParentBindingMetadataResultMock);

      result = isNotParentBindingMetadataWithTag(tagFixture, tagValueFixture);
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

    it('should call isNotParentBindingMetadata()', () => {
      expect(isNotParentBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isNotParentBindingMetadata).toHaveBeenCalledWith(
        isBindingMetadataWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isNotParentBindingMetadataResultMock);
    });
  });
});
