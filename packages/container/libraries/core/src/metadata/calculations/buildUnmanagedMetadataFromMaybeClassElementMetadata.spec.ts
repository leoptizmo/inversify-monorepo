import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./buildClassElementMetadataFromMaybeClassElementMetadata', () => ({
  buildClassElementMetadataFromMaybeClassElementMetadata: jest
    .fn()
    .mockReturnValue(jest.fn()),
}));

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { buildUnmanagedMetadataFromMaybeClassElementMetadata } from './buildUnmanagedMetadataFromMaybeClassElementMetadata';

describe(buildUnmanagedMetadataFromMaybeClassElementMetadata.name, () => {
  describe('when called', () => {
    let buildClassMetadataMock: jest.Mock<
      (metadata: MaybeClassElementMetadata | undefined) => ClassElementMetadata
    >;

    let result: unknown;

    beforeAll(() => {
      buildClassMetadataMock = jest.fn();

      (
        buildUnmanagedMetadataFromMaybeClassElementMetadata as jest.Mock<
          typeof buildUnmanagedMetadataFromMaybeClassElementMetadata
        >
      ).mockReturnValueOnce(buildClassMetadataMock);

      result = buildUnmanagedMetadataFromMaybeClassElementMetadata();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return expected function', () => {
      expect(result).toBe(buildClassMetadataMock);
    });
  });
});
