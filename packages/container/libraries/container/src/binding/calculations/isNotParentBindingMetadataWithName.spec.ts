import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata, MetadataName } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithName');
jest.mock('./isNotParentBindingMetadata');

import { isBindingMetadataWithName } from './isBindingMetadataWithName';
import { isNotParentBindingMetadata } from './isNotParentBindingMetadata';
import { isNotParentBindingMetadataWithName } from './isNotParentBindingMetadataWithName';

describe(isNotParentBindingMetadataWithName.name, () => {
  let nameFixture: MetadataName;

  beforeAll(() => {
    nameFixture = 'name-fixture';
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
        isBindingMetadataWithName as jest.Mock<typeof isBindingMetadataWithName>
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isNotParentBindingMetadata as jest.Mock<
          typeof isNotParentBindingMetadata
        >
      ).mockReturnValueOnce(isNotParentBindingMetadataResultMock);

      result = isNotParentBindingMetadataWithName(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingMetadataWithName()', () => {
      expect(isBindingMetadataWithName).toHaveBeenCalledTimes(1);
      expect(isBindingMetadataWithName).toHaveBeenCalledWith(nameFixture);
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
