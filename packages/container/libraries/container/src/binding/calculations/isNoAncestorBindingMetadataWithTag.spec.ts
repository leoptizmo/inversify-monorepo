import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithTag');
jest.mock('./isNoAncestorBindingMetadata');

import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';
import { isNoAncestorBindingMetadata } from './isNoAncestorBindingMetadata';
import { isNoAncestorBindingMetadataWithTag } from './isNoAncestorBindingMetadataWithTag';

describe(isNoAncestorBindingMetadataWithTag.name, () => {
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
    let isNoAncestorBindingMetadataResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingMetadataWithNameResultMock = jest.fn();
      isNoAncestorBindingMetadataResultMock = jest.fn();

      (
        isBindingMetadataWithTag as jest.Mock<typeof isBindingMetadataWithTag>
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isNoAncestorBindingMetadata as jest.Mock<
          typeof isNoAncestorBindingMetadata
        >
      ).mockReturnValueOnce(isNoAncestorBindingMetadataResultMock);

      result = isNoAncestorBindingMetadataWithTag(tagFixture, tagValueFixture);
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

    it('should call isNoAncestorBindingMetadata()', () => {
      expect(isNoAncestorBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isNoAncestorBindingMetadata).toHaveBeenCalledWith(
        isBindingMetadataWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isNoAncestorBindingMetadataResultMock);
    });
  });
});
