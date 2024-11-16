import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

jest.mock('./buildClassElementMetadataFromMaybeClassElementMetadata', () => ({
  buildClassElementMetadataFromMaybeClassElementMetadata: jest
    .fn()
    .mockReturnValue(jest.fn()),
}));

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { buildManagedMetadataFromMaybeClassElementMetadata } from './buildManagedMetadataFromMaybeClassElementMetadata';

describe(buildManagedMetadataFromMaybeClassElementMetadata.name, () => {
  let kindFixture:
    | ClassElementMetadataKind.multipleInjection
    | ClassElementMetadataKind.singleInjection;
  let serviceIdentifierFixture: ServiceIdentifier | LazyServiceIdentifier;

  beforeAll(() => {
    kindFixture = ClassElementMetadataKind.multipleInjection;
    serviceIdentifierFixture = 'service-id';
  });

  describe('when called', () => {
    let buildClassMetadataMock: jest.Mock<
      (metadata: MaybeClassElementMetadata | undefined) => ClassElementMetadata
    >;

    let result: unknown;

    beforeAll(() => {
      buildClassMetadataMock = jest.fn();

      (
        buildManagedMetadataFromMaybeClassElementMetadata as jest.Mock<
          typeof buildManagedMetadataFromMaybeClassElementMetadata
        >
      ).mockReturnValueOnce(buildClassMetadataMock);

      result = buildManagedMetadataFromMaybeClassElementMetadata(
        kindFixture,
        serviceIdentifierFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return expected function', () => {
      expect(result).toBe(buildClassMetadataMock);
    });
  });
});
