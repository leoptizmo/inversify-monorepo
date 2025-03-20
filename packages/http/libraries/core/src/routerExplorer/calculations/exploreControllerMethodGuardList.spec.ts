import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodGuardMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodGuardMetadataReflectKey';
import { exploreControllerMethodGuardList } from './exploreControllerMethodGuardList';

describe(exploreControllerMethodGuardList.name, () => {
  describe('when called and getReflectMetadata returns undefined', () => {
    let controllerMethodFixture: ControllerFunction;
    let result: unknown;

    beforeAll(() => {
      controllerMethodFixture = (() => {}) as ControllerFunction;

      result = exploreControllerMethodGuardList(controllerMethodFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        controllerMethodFixture,
        controllerMethodGuardMetadataReflectKey,
      );
    });

    it('should return an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when called and getReflectMetadata returns an array', () => {
    let controllerMethodFixture: ControllerFunction;
    let controllerMethodGuardFixtures: NewableFunction[];
    let result: unknown;

    beforeAll(() => {
      controllerMethodFixture = (() => {}) as ControllerFunction;
      controllerMethodGuardFixtures = [];

      vitest
        .mocked(getReflectMetadata)
        .mockReturnValueOnce(controllerMethodGuardFixtures);

      result = exploreControllerMethodGuardList(controllerMethodFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        controllerMethodFixture,
        controllerMethodGuardMetadataReflectKey,
      );
    });

    it('should return an array', () => {
      expect(result).toBe(controllerMethodGuardFixtures);
    });
  });
});
