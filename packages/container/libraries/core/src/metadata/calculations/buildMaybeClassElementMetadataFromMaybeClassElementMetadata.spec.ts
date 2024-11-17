import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { UnmanagedClassElementMetadata } from '../models/UnmanagedClassElementMetadata';
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from './buildMaybeClassElementMetadataFromMaybeClassElementMetadata';

describe(
  buildMaybeClassElementMetadataFromMaybeClassElementMetadata.name,
  () => {
    describe('having unmanaged metadata', () => {
      let metadataFixture: UnmanagedClassElementMetadata;
      let updateMetadataMock: jest.Mock<
        (
          metadata:
            | ManagedClassElementMetadata
            | MaybeManagedClassElementMetadata,
        ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata
      >;

      beforeAll(() => {
        metadataFixture = {
          kind: ClassElementMetadataKind.unmanaged,
        };
        updateMetadataMock = jest.fn();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
              updateMetadataMock,
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
      let metadataFixture: ManagedClassElementMetadata;
      let updateMetadataMock: jest.Mock<
        (
          metadata:
            | ManagedClassElementMetadata
            | MaybeManagedClassElementMetadata,
        ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata
      >;

      beforeAll(() => {
        metadataFixture = {
          kind: ClassElementMetadataKind.singleInjection,
          name: undefined,
          optional: false,
          tags: new Map([['foo', 'bar']]),
          targetName: undefined,
          value: 'service-identifier',
        };
        updateMetadataMock = jest.fn();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          updateMetadataMock.mockReturnValueOnce(metadataFixture);

          result =
            buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
              updateMetadataMock,
            )(metadataFixture);
        });

        it('should return ManagedClassElementMetadata', () => {
          expect(result).toBe(metadataFixture);
        });
      });
    });
  },
);
