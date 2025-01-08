import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithTag');
jest.mock('./isBindingMetadataWithRightParent');

import { isBindingMetadataWithRightParent } from './isBindingMetadataWithRightParent';
import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';
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
    let isBindingMetadataWithRightParentResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingMetadataWithNameResultMock = jest.fn();
      isBindingMetadataWithRightParentResultMock = jest.fn();

      (
        isBindingMetadataWithTag as jest.Mock<typeof isBindingMetadataWithTag>
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isBindingMetadataWithRightParent as jest.Mock<
          typeof isBindingMetadataWithRightParent
        >
      ).mockReturnValueOnce(isBindingMetadataWithRightParentResultMock);

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

    it('should call isBindingMetadataWithRightParent()', () => {
      expect(isBindingMetadataWithRightParent).toHaveBeenCalledTimes(1);
      expect(isBindingMetadataWithRightParent).toHaveBeenCalledWith(
        isBindingMetadataWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isBindingMetadataWithRightParentResultMock);
    });
  });
});
