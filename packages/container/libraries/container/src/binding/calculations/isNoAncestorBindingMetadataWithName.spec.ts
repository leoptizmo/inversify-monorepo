import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata, MetadataName } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithName');
jest.mock('./isNoAncestorBindingMetadata');

import { isBindingMetadataWithName } from './isBindingMetadataWithName';
import { isNoAncestorBindingMetadata } from './isNoAncestorBindingMetadata';
import { isNoAncestorBindingMetadataWithName } from './isNoAncestorBindingMetadataWithName';

describe(isNoAncestorBindingMetadataWithName.name, () => {
  let nameFixture: MetadataName;

  beforeAll(() => {
    nameFixture = 'name-fixture';
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
        isBindingMetadataWithName as jest.Mock<typeof isBindingMetadataWithName>
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isNoAncestorBindingMetadata as jest.Mock<
          typeof isNoAncestorBindingMetadata
        >
      ).mockReturnValueOnce(isNoAncestorBindingMetadataResultMock);

      result = isNoAncestorBindingMetadataWithName(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingMetadataWithName()', () => {
      expect(isBindingMetadataWithName).toHaveBeenCalledTimes(1);
      expect(isBindingMetadataWithName).toHaveBeenCalledWith(nameFixture);
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
