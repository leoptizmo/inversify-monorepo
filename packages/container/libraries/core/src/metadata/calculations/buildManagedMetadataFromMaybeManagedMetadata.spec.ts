import { beforeAll, describe, expect, it } from '@jest/globals';

import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
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
        targetName: 'target-name-fixture',
      };

      result = buildManagedMetadataFromMaybeManagedMetadata(
        metadataFixture,
        kindFixture,
        serviceIdentifierFixture,
      );
    });

    it('should return ManagedClassElementMetadata', () => {
      const expected: ManagedClassElementMetadata = {
        kind: kindFixture,
        name: metadataFixture.name,
        optional: metadataFixture.optional,
        tags: metadataFixture.tags,
        targetName: metadataFixture.targetName,
        value: serviceIdentifierFixture,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
