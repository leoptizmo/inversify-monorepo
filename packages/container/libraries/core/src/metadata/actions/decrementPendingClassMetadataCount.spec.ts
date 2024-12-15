import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import { updateReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { pendingClassMetadataCountReflectKey } from '../../reflectMetadata/data/pendingClassMetadataCountReflectKey';
import { getDefaultPendingClassMetadataCount } from '../calculations/getDefaultPendingClassMetadataCount';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';
import { decrementPendingClassMetadataCount } from './decrementPendingClassMetadataCount';

describe(decrementPendingClassMetadataCount.name, () => {
  let typeFixture: object;

  beforeAll(() => {
    typeFixture = class {};
  });

  describe('with unknown metadata', () => {
    let metadataFixture: MaybeClassElementMetadata;

    beforeAll(() => {
      metadataFixture = {
        kind: MaybeClassElementMetadataKind.unknown,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          decrementPendingClassMetadataCount(typeFixture)(metadataFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call updateReflectMetadata', () => {
        expect(updateReflectMetadata).toHaveBeenCalledTimes(1);
        expect(updateReflectMetadata).toHaveBeenCalledWith(
          typeFixture,
          pendingClassMetadataCountReflectKey,
          getDefaultPendingClassMetadataCount,
          expect.any(Function),
        );
      });

      it('should return expected value', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('with undefined metadata', () => {
    let metadataFixture: undefined;

    beforeAll(() => {
      metadataFixture = undefined;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          decrementPendingClassMetadataCount(typeFixture)(metadataFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should not call updateReflectMetadata', () => {
        expect(updateReflectMetadata).not.toHaveBeenCalled();
      });

      it('should return expected value', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('with non uknown metadata', () => {
    let metadataFixture: MaybeClassElementMetadata;

    beforeAll(() => {
      metadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          decrementPendingClassMetadataCount(typeFixture)(metadataFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should not call updateReflectMetadata', () => {
        expect(updateReflectMetadata).not.toHaveBeenCalled();
      });

      it('should return expected value', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
