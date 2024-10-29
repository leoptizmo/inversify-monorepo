import { beforeAll, describe, expect, it } from '@jest/globals';

import { ServiceIdentifier } from '@inversifyjs/common';

import {
  INJECT_TAG,
  MULTI_INJECT_TAG,
  NAME_TAG,
  NAMED_TAG,
  OPTIONAL_TAG,
  UNMANAGED_TAG,
} from '../../reflectMetadata/data/keys';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { MetadataName } from '../models/MetadataName';
import { MetadataTag } from '../models/MetadataTag';
import { MetadataTargetName } from '../models/MetadataTargetName';
import { getClassElementMetadataFromLegacyMetadata } from './getClassElementMetadataFromLegacyMetadata';

describe(getClassElementMetadataFromLegacyMetadata.name, () => {
  describe('having an empty metadata list', () => {
    let metadataListFixture: LegacyMetadata[];

    beforeAll(() => {
      metadataListFixture = [];
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        try {
          getClassElementMetadataFromLegacyMetadata(metadataListFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<Error> = {
          message: 'Expected @inject, @multiInject or @unmanaged metadata',
        };

        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('having a metadata list with unmanaged metadata', () => {
    let metadataListFixture: LegacyMetadata[];

    beforeAll(() => {
      metadataListFixture = [
        {
          key: UNMANAGED_TAG,
          value: true,
        },
      ];
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getClassElementMetadataFromLegacyMetadata(metadataListFixture);
      });

      it('should return ClassElementMetadata', () => {
        const expectedClassElementMetadata: ClassElementMetadata = {
          kind: ClassElementMetadataKind.unmanaged,
        };

        expect(result).toStrictEqual(expectedClassElementMetadata);
      });
    });
  });

  describe.each<[string, LegacyMetadata]>([
    [
      'inject',
      {
        key: INJECT_TAG,
        value: Symbol(),
      },
    ],
    [
      'multi inject',
      {
        key: MULTI_INJECT_TAG,
        value: Symbol(),
      },
    ],
  ])(
    'having a metadata list with both unmanaged and %s metadata',
    (_: string, metadata: LegacyMetadata) => {
      let metadataListFixture: LegacyMetadata[];

      beforeAll(() => {
        metadataListFixture = [
          {
            key: UNMANAGED_TAG,
            value: true,
          },
          metadata,
        ];
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            getClassElementMetadataFromLegacyMetadata(metadataListFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          const expectedErrorProperties: Partial<Error> = {
            message:
              'Expected a single @inject, @multiInject or @unmanaged metadata',
          };

          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    },
  );

  describe.each<[string, ClassElementMetadataKind, LegacyMetadata]>([
    [
      'inject',
      ClassElementMetadataKind.singleInjection,
      {
        key: INJECT_TAG,
        value: Symbol(),
      },
    ],
    [
      'multi inject',
      ClassElementMetadataKind.multipleInjection,
      {
        key: MULTI_INJECT_TAG,
        value: Symbol(),
      },
    ],
  ])(
    'having a metadata list with % metadata',
    (
      _: string,
      classElementMetadataKind: ClassElementMetadataKind,
      metadata: LegacyMetadata,
    ) => {
      let metadataListFixture: LegacyMetadata[];

      beforeAll(() => {
        metadataListFixture = [metadata];
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            getClassElementMetadataFromLegacyMetadata(metadataListFixture);
        });

        it('should return ClassElementMetadata', () => {
          const expectedClassElementMetadata: ClassElementMetadata = {
            kind: classElementMetadataKind,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: metadata.value as ServiceIdentifier,
          };

          expect(result).toStrictEqual(expectedClassElementMetadata);
        });
      });
    },
  );

  describe.each<[string, ClassElementMetadataKind, LegacyMetadata]>([
    [
      'inject',
      ClassElementMetadataKind.singleInjection,
      {
        key: INJECT_TAG,
        value: Symbol(),
      },
    ],
    [
      'multi inject',
      ClassElementMetadataKind.multipleInjection,
      {
        key: MULTI_INJECT_TAG,
        value: Symbol(),
      },
    ],
  ])(
    'having a metadata list with % metadata',
    (
      _: string,
      classElementMetadataKind: ClassElementMetadataKind,
      metadata: LegacyMetadata,
    ) => {
      let customTagMetadataFixture: LegacyMetadata;
      let nameMetadataFixture: LegacyMetadata;
      let optionalMetadataFixture: LegacyMetadata;
      let targetNameMetadataFixture: LegacyMetadata;
      let metadataListFixture: LegacyMetadata[];

      beforeAll(() => {
        customTagMetadataFixture = {
          key: 'customTag',
          value: 'customTagValue',
        };
        nameMetadataFixture = {
          key: NAME_TAG,
          value: 'name-fixture',
        };
        optionalMetadataFixture = {
          key: OPTIONAL_TAG,
          value: true,
        };
        targetNameMetadataFixture = {
          key: NAMED_TAG,
          value: 'target-name-fixture',
        };
        metadataListFixture = [
          metadata,
          customTagMetadataFixture,
          nameMetadataFixture,
          optionalMetadataFixture,
          targetNameMetadataFixture,
        ];
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result =
            getClassElementMetadataFromLegacyMetadata(metadataListFixture);
        });

        it('should return ClassElementMetadata', () => {
          const expectedClassElementMetadata: ClassElementMetadata = {
            kind: classElementMetadataKind,
            name: nameMetadataFixture.value as MetadataName,
            optional: true,
            tags: new Map<MetadataTag, unknown>([
              [
                customTagMetadataFixture.key as MetadataTag,
                customTagMetadataFixture.value,
              ],
            ]),
            targetName: targetNameMetadataFixture.value as MetadataTargetName,
            value: metadata.value as ServiceIdentifier,
          };

          expect(result).toStrictEqual(expectedClassElementMetadata);
        });
      });
    },
  );
});
