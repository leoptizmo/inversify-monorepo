import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

jest.mock('./assertMetadataFromTypescriptIfManaged');

import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { assertMetadataFromTypescriptIfManaged } from './assertMetadataFromTypescriptIfManaged';
import { buildManagedMetadataFromMaybeManagedMetadata } from './buildManagedMetadataFromMaybeManagedMetadata';

describe(buildManagedMetadataFromMaybeManagedMetadata.name, () => {
  describe('when called', () => {
    let metadataFixture: MaybeManagedClassElementMetadata;
    let kindFixture:
      | ClassElementMetadataKind.singleInjection
      | ClassElementMetadataKind.multipleInjection;
    let serviceIdentifierFixture: ServiceIdentifier | LazyServiceIdentifier;

    let result: unknown;

    beforeAll(() => {
      metadataFixture = {
        kind: MaybeClassElementMetadataKind.unknown,
        name: 'name-fixture',
        optional: true,
        tags: new Map(),
      };

      kindFixture = ClassElementMetadataKind.singleInjection;
      serviceIdentifierFixture = Symbol();

      result = buildManagedMetadataFromMaybeManagedMetadata(
        metadataFixture,
        kindFixture,
        serviceIdentifierFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call assertMetadataFromTypescriptIfManaged()', () => {
      expect(assertMetadataFromTypescriptIfManaged).toHaveBeenCalledTimes(1);
      expect(assertMetadataFromTypescriptIfManaged).toHaveBeenCalledWith(
        metadataFixture,
      );
    });

    it('should return ManagedClassElementMetadata', () => {
      const expected: ManagedClassElementMetadata = {
        kind: kindFixture,
        name: metadataFixture.name,
        optional: metadataFixture.optional,
        tags: metadataFixture.tags,
        value: serviceIdentifierFixture,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
