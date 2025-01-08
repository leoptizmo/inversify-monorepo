import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata, MetadataName } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithName');
jest.mock('./isAnyAncestorBindingMetadata');

import { isAnyAncestorBindingMetadata } from './isAnyAncestorBindingMetadata';
import { isAnyAncestorBindingMetadataWithName } from './isAnyAncestorBindingMetadataWithName';
import { isBindingMetadataWithName } from './isBindingMetadataWithName';

describe(isAnyAncestorBindingMetadataWithName.name, () => {
  let nameFixture: MetadataName;

  beforeAll(() => {
    nameFixture = 'name-fixture';
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
        isBindingMetadataWithName as jest.Mock<typeof isBindingMetadataWithName>
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isAnyAncestorBindingMetadata as jest.Mock<
          typeof isAnyAncestorBindingMetadata
        >
      ).mockReturnValueOnce(isAnyAncestorBindingMetadataResultMock);

      result = isAnyAncestorBindingMetadataWithName(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingMetadataWithName()', () => {
      expect(isBindingMetadataWithName).toHaveBeenCalledTimes(1);
      expect(isBindingMetadataWithName).toHaveBeenCalledWith(nameFixture);
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
