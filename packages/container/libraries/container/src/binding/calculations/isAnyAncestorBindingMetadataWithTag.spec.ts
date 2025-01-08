import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithTag');
jest.mock('./isAnyAncestorBindingMetadata');

import { isAnyAncestorBindingMetadata } from './isAnyAncestorBindingMetadata';
import { isAnyAncestorBindingMetadataWithTag } from './isAnyAncestorBindingMetadataWithTag';
import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';

describe(isAnyAncestorBindingMetadataWithTag.name, () => {
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
    let isAnyAncestorBindingMetadataResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingMetadataWithNameResultMock = jest.fn();
      isAnyAncestorBindingMetadataResultMock = jest.fn();

      (
        isBindingMetadataWithTag as jest.Mock<typeof isBindingMetadataWithTag>
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isAnyAncestorBindingMetadata as jest.Mock<
          typeof isAnyAncestorBindingMetadata
        >
      ).mockReturnValueOnce(isAnyAncestorBindingMetadataResultMock);

      result = isAnyAncestorBindingMetadataWithTag(tagFixture, tagValueFixture);
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

    it('should call isAnyAncestorBindingMetadata()', () => {
      expect(isAnyAncestorBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isAnyAncestorBindingMetadata).toHaveBeenCalledWith(
        isBindingMetadataWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isAnyAncestorBindingMetadataResultMock);
    });
  });
});
