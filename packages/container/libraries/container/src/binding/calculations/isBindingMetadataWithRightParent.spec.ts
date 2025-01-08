import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata } from '@inversifyjs/core';

import { isBindingMetadataWithRightParent } from './isBindingMetadataWithRightParent';

describe(isBindingMetadataWithRightParent.name, () => {
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

      result = isBindingMetadataWithRightParent(constraintMock)(metadataMock);
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

  describe('when called, and metadata.getAncestor() returns BindingMetadata', () => {
    let constraintResultFixture: boolean;

    let result: unknown;

    beforeAll(() => {
      constraintResultFixture = true;

      metadataMock.getAncestor.mockReturnValueOnce(metadataMock);

      constraintMock.mockReturnValueOnce(constraintResultFixture);

      result = isBindingMetadataWithRightParent(constraintMock)(metadataMock);
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
      expect(result).toBe(constraintResultFixture);
    });
  });
});
