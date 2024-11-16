import { beforeAll, describe, expect, it } from '@jest/globals';

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { MetadataTag } from '../models/MetadataTag';
import { UnmanagedClassElementMetadata } from '../models/UnmanagedClassElementMetadata';
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from './buildMaybeClassElementMetadataFromMaybeClassElementMetadata';

describe(
  buildMaybeClassElementMetadataFromMaybeClassElementMetadata.name,
  () => {
    describe('having unmanaged metadata', () => {
      let metadataPartialFixture: Partial<MaybeManagedClassElementMetadata>;
      let metadataFixture: UnmanagedClassElementMetadata;

      beforeAll(() => {
        metadataPartialFixture = {};
        metadataFixture = {
          kind: ClassElementMetadataKind.unmanaged,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
              metadataPartialFixture,
            )(metadataFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an InversifyCoreError', () => {
          const expectedErrorProperties: Partial<InversifyCoreError> = {
            kind: InversifyCoreErrorKind.injectionDecoratorConflict,
            message:
              'Unexpected injection found. Found @unmanaged injection with additional @named, @optional, @tagged or @targetName injections',
          };

          expect(result).toBeInstanceOf(InversifyCoreError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having non unmanaged metadata', () => {
      let metadataPartialFixture: Partial<MaybeManagedClassElementMetadata>;
      let metadataFixture: ManagedClassElementMetadata;

      beforeAll(() => {
        metadataPartialFixture = {
          name: 'name-fixture',
          optional: true,
          targetName: 'target-name-fixture',
        };
        metadataFixture = {
          kind: ClassElementMetadataKind.singleInjection,
          name: undefined,
          optional: false,
          tags: new Map([['foo', 'bar']]),
          targetName: undefined,
          value: 'service-identifier',
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
            metadataPartialFixture,
          )(metadataFixture);
        });

        it('should return ManagedClassElementMetadata', () => {
          const expected:
            | ManagedClassElementMetadata
            | MaybeManagedClassElementMetadata = {
            ...metadataFixture,
            ...metadataPartialFixture,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having non unmanaged metadata and partial metadata with tags', () => {
      let metadataPartialFixture: Partial<MaybeManagedClassElementMetadata>;
      let metadataFixture: ManagedClassElementMetadata;

      beforeAll(() => {
        metadataPartialFixture = {
          name: 'name-fixture',
          optional: true,
          tags: new Map([['bar', 'baz']]),
          targetName: 'target-name-fixture',
        };
        metadataFixture = {
          kind: ClassElementMetadataKind.singleInjection,
          name: undefined,
          optional: false,
          tags: new Map([['foo', 'bar']]),
          targetName: undefined,
          value: 'service-identifier',
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
            metadataPartialFixture,
          )(metadataFixture);
        });

        it('should return ManagedClassElementMetadata', () => {
          const expected:
            | ManagedClassElementMetadata
            | MaybeManagedClassElementMetadata = {
            ...metadataFixture,
            ...metadataPartialFixture,
            tags: new Map([
              ...metadataFixture.tags,
              ...(metadataPartialFixture.tags as Map<MetadataTag, unknown>),
            ]),
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  },
);
