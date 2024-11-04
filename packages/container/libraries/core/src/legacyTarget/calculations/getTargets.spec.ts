import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./getTargetsFromMetadataProviders');

import { getClassMetadata } from '../../metadata/calculations/getClassMetadata';
import { getClassMetadataProperties } from '../../metadata/calculations/getClassMetadataProperties';
import { LegacyMetadataReader } from '../../metadata/models/LegacyMetadataReader';
import { LegacyTarget } from '../models/LegacyTarget';
import { getTargets } from './getTargets';
import { getTargetsFromMetadataProviders } from './getTargetsFromMetadataProviders';

describe(getTargets.name, () => {
  describe('having no metadata reader', () => {
    describe('when called', () => {
      let targetsFixture: LegacyTarget[];

      let result: unknown;

      beforeAll(() => {
        targetsFixture = [];

        (
          getTargetsFromMetadataProviders as jest.Mock<
            typeof getTargetsFromMetadataProviders
          >
        ).mockReturnValueOnce(() => targetsFixture);

        result = getTargets()(class {});
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getTargets()', () => {
        expect(getTargetsFromMetadataProviders).toHaveBeenCalledTimes(1);
        expect(getTargetsFromMetadataProviders).toHaveBeenCalledWith(
          getClassMetadata,
          getClassMetadataProperties,
        );
      });

      it('should return LegacyTarget[]', () => {
        expect(result).toBe(targetsFixture);
      });
    });
  });

  describe('having metadata reader', () => {
    let metadataReaderFixture: LegacyMetadataReader;

    beforeAll(() => {
      metadataReaderFixture = Symbol() as unknown as LegacyMetadataReader;
    });

    describe('when called', () => {
      let targetsFixture: LegacyTarget[];

      let result: unknown;

      beforeAll(() => {
        targetsFixture = [];

        (
          getTargetsFromMetadataProviders as jest.Mock<
            typeof getTargetsFromMetadataProviders
          >
        ).mockReturnValueOnce(() => targetsFixture);

        result = getTargets(metadataReaderFixture)(class {});
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getTargets()', () => {
        expect(getTargetsFromMetadataProviders).toHaveBeenCalledTimes(1);
        expect(getTargetsFromMetadataProviders).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function),
        );
      });

      it('should return LegacyTarget[]', () => {
        expect(result).toBe(targetsFixture);
      });
    });
  });
});
