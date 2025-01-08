import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata } from '@inversifyjs/core';

import { isAnyAncestorBindingMetadata } from './isAnyAncestorBindingMetadata';

describe(isAnyAncestorBindingMetadata.name, () => {
  let constraintMock: jest.Mock<(metadata: BindingMetadata) => boolean>;
  let metadataMock: jest.Mocked<BindingMetadata>;

  beforeAll(() => {
    constraintMock = jest.fn();
    metadataMock = {
      getAncestor: jest.fn(),
    } as Partial<jest.Mocked<BindingMetadata>> as jest.Mocked<BindingMetadata>;
  });

  describe('when called, and metadata.getAncestor() returns undefined', () => {
    let result: unknown;

    beforeAll(() => {
      metadataMock.getAncestor.mockReturnValueOnce(undefined);

      result = isAnyAncestorBindingMetadata(constraintMock)(metadataMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadata.getAncestor()', () => {
      expect(metadataMock.getAncestor).toHaveBeenCalledTimes(1);
      expect(metadataMock.getAncestor).toHaveBeenCalledWith();
    });

    it('should not call constraint()', () => {
      expect(constraintMock).not.toHaveBeenCalled();
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('when called, and metadata.getAncestor() returns BindingMetadata and then undefined and constraint() returns false', () => {
    let result: unknown;

    beforeAll(() => {
      metadataMock.getAncestor
        .mockReturnValueOnce(metadataMock)
        .mockReturnValueOnce(undefined);

      constraintMock.mockReturnValueOnce(false);

      result = isAnyAncestorBindingMetadata(constraintMock)(metadataMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadata.getAncestor()', () => {
      expect(metadataMock.getAncestor).toHaveBeenCalledTimes(2);
      expect(metadataMock.getAncestor).toHaveBeenNthCalledWith(1);
      expect(metadataMock.getAncestor).toHaveBeenNthCalledWith(2);
    });

    it('should call constraint()', () => {
      expect(constraintMock).toHaveBeenCalledTimes(1);
      expect(constraintMock).toHaveBeenCalledWith(metadataMock);
    });

    it('should return expected result', () => {
      expect(result).toBe(false);
    });
  });

  describe('when called, and metadata.getAncestor() returns BindingMetadata and constraint() returns true', () => {
    let result: unknown;

    beforeAll(() => {
      metadataMock.getAncestor.mockReturnValueOnce(metadataMock);

      constraintMock.mockReturnValueOnce(true);

      result = isAnyAncestorBindingMetadata(constraintMock)(metadataMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadata.getAncestor()', () => {
      expect(metadataMock.getAncestor).toHaveBeenCalledTimes(1);
      expect(metadataMock.getAncestor).toHaveBeenCalledWith();
    });

    it('should call constraint()', () => {
      expect(constraintMock).toHaveBeenCalledTimes(1);
      expect(constraintMock).toHaveBeenCalledWith(metadataMock);
    });

    it('should return expected result', () => {
      expect(result).toBe(true);
    });
  });
});
