import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { controllerMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMiddlewareMetadataReflectKey';
import { exploreControllerMiddlewareList } from './exploreControllerMiddlewareList';

describe(exploreControllerMiddlewareList.name, () => {
  describe('when called and getReflectMetadata returns undefined', () => {
    let targetFixture: NewableFunction;
    let result: unknown;

    beforeAll(() => {
      targetFixture = class Test {};

      result = exploreControllerMiddlewareList(targetFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        controllerMiddlewareMetadataReflectKey,
      );
    });

    it('should return an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when called and getReflectMetadata returns an array', () => {
    let targetFixture: NewableFunction;
    let middlewareFixtures: NewableFunction[];
    let result: unknown;

    beforeAll(() => {
      targetFixture = class Test {};
      middlewareFixtures = [];

      vitest.mocked(getReflectMetadata).mockReturnValueOnce(middlewareFixtures);

      result = exploreControllerMiddlewareList(targetFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        controllerMiddlewareMetadataReflectKey,
      );
    });

    it('should return an array', () => {
      expect(result).toBe(middlewareFixtures);
    });
  });
});
