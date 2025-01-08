import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata, MetadataName } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithName');
jest.mock('./isParentBindingMetadata');

import { isBindingMetadataWithName } from './isBindingMetadataWithName';
import { isParentBindingMetadata } from './isParentBindingMetadata';
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
    let isParentBindingMetadataResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingMetadataWithNameResultMock = jest.fn();
      isParentBindingMetadataResultMock = jest.fn();

      (
        isBindingMetadataWithName as jest.Mock<typeof isBindingMetadataWithName>
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isParentBindingMetadata as jest.Mock<typeof isParentBindingMetadata>
      ).mockReturnValueOnce(isParentBindingMetadataResultMock);

      result = isParentBindingMetadataWithName(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingMetadataWithName()', () => {
      expect(isBindingMetadataWithName).toHaveBeenCalledTimes(1);
      expect(isBindingMetadataWithName).toHaveBeenCalledWith(nameFixture);
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
