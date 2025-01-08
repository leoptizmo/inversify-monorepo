import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata, MetadataName } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithName');
jest.mock('./isBindingMetadataWithRightParent');

import { isBindingMetadataWithName } from './isBindingMetadataWithName';
import { isBindingMetadataWithRightParent } from './isBindingMetadataWithRightParent';
import { isParentBindingMetadataWithName } from './isParentBindingMetadataWithName';

describe(isParentBindingMetadataWithName.name, () => {
  let nameFixture: MetadataName;

  beforeAll(() => {
    nameFixture = 'name-fixture';
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
        isBindingMetadataWithName as jest.Mock<typeof isBindingMetadataWithName>
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isBindingMetadataWithRightParent as jest.Mock<
          typeof isBindingMetadataWithRightParent
        >
      ).mockReturnValueOnce(isBindingMetadataWithRightParentResultMock);

      result = isParentBindingMetadataWithName(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingMetadataWithName()', () => {
      expect(isBindingMetadataWithName).toHaveBeenCalledTimes(1);
      expect(isBindingMetadataWithName).toHaveBeenCalledWith(nameFixture);
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
