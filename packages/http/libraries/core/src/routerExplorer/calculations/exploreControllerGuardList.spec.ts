import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { controllerGuardMetadataReflectKey } from '../../reflectMetadata/data/controllerGuardMetadataReflectKey';
import { exploreControllerGuardList } from './exploreControllerGuardList';

describe(exploreControllerGuardList.name, () => {
  describe('when called and getReflectMetadata returns undefined', () => {
    let controllerFixture: NewableFunction;
    let result: unknown;

    beforeAll(() => {
      controllerFixture = class Test {};

      result = exploreControllerGuardList(controllerFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        controllerFixture,
        controllerGuardMetadataReflectKey,
      );
    });

    it('should return an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when called and getReflectMetadata returns an array', () => {
    let controllerFixture: NewableFunction;
    let controllerGuardFixtures: NewableFunction[];
    let result: unknown;

    beforeAll(() => {
      controllerFixture = class Test {};
      controllerGuardFixtures = [];

      vitest
        .mocked(getReflectMetadata)
        .mockReturnValueOnce(controllerGuardFixtures);

      result = exploreControllerGuardList(controllerFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        controllerFixture,
        controllerGuardMetadataReflectKey,
      );
    });

    it('should return an array', () => {
      expect(result).toBe(controllerGuardFixtures);
    });
  });
});
