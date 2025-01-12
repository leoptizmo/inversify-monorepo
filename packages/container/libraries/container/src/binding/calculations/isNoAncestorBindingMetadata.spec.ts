import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata } from '@inversifyjs/core';

jest.mock('./isAnyAncestorBindingMetadata');

import { isAnyAncestorBindingMetadata } from './isAnyAncestorBindingMetadata';
import { isNoAncestorBindingMetadata } from './isNoAncestorBindingMetadata';

describe(isNoAncestorBindingMetadata.name, () => {
  let constraintMock: jest.Mock<(metadata: BindingMetadata) => boolean>;
  let isAnyAncestorBindingMetadataConstraintMock: jest.Mock<
    (metadata: BindingMetadata) => boolean
  >;

  beforeAll(() => {
    constraintMock = jest.fn();
    isAnyAncestorBindingMetadataConstraintMock = jest.fn();
    (
      isAnyAncestorBindingMetadata as jest.Mock<
        typeof isAnyAncestorBindingMetadata
      >
    ).mockReturnValue(isAnyAncestorBindingMetadataConstraintMock);
  });

  describe('when called, and isAnyAncestorBindingMetadata() returns true', () => {
    let metadataFixture: BindingMetadata;
    let result: boolean;

    beforeAll(() => {
      metadataFixture = Symbol() as unknown as BindingMetadata;
      isAnyAncestorBindingMetadataConstraintMock.mockReturnValueOnce(true);

      result = isNoAncestorBindingMetadata(constraintMock)(metadataFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isAnyAncestorBindingMetadata()', () => {
      expect(isAnyAncestorBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isAnyAncestorBindingMetadata).toHaveBeenCalledWith(constraintMock);
    });

    it('should call isAnyAncestorBindingMetadataConstraint()', () => {
      expect(isAnyAncestorBindingMetadataConstraintMock).toHaveBeenCalledTimes(
        1,
      );
      expect(isAnyAncestorBindingMetadataConstraintMock).toHaveBeenCalledWith(
        metadataFixture,
      );
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('when called, and isAnyAncestorBindingMetadata() returns false', () => {
    let metadataFixture: BindingMetadata;
    let result: boolean;

    beforeAll(() => {
      metadataFixture = {} as BindingMetadata;
      isAnyAncestorBindingMetadataConstraintMock.mockReturnValueOnce(false);

      result = isNoAncestorBindingMetadata(constraintMock)(metadataFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isAnyAncestorBindingMetadata()', () => {
      expect(isAnyAncestorBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isAnyAncestorBindingMetadata).toHaveBeenCalledWith(constraintMock);
    });

    it('should call isAnyAncestorBindingMetadataConstraint()', () => {
      expect(isAnyAncestorBindingMetadataConstraintMock).toHaveBeenCalledTimes(
        1,
      );
      expect(isAnyAncestorBindingMetadataConstraintMock).toHaveBeenCalledWith(
        metadataFixture,
      );
    });

    it('should return true', () => {
      expect(result).toBe(true);
    });
  });
});
