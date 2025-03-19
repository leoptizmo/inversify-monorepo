import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodMiddlewareMetadataReflectKey';
import { exploreControllerMethodMiddlewareList } from './exploreControllerMethodMiddlewareList';

describe(exploreControllerMethodMiddlewareList.name, () => {
  describe('when called and getReflectMetadata returns undefined', () => {
    let controllerMethodFixture: ControllerFunction;
    let result: unknown;

    beforeAll(() => {
      controllerMethodFixture = (() => {}) as ControllerFunction;

      result = exploreControllerMethodMiddlewareList(controllerMethodFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        controllerMethodFixture,
        controllerMethodMiddlewareMetadataReflectKey,
      );
    });

    it('should return an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when called and getReflectMetadata returns an array', () => {
    let controllerMethodFixture: ControllerFunction;
    let middlewareFixtures: NewableFunction[];
    let result: unknown;

    beforeAll(() => {
      controllerMethodFixture = (() => {}) as ControllerFunction;
      middlewareFixtures = [];

      vitest.mocked(getReflectMetadata).mockReturnValueOnce(middlewareFixtures);

      result = exploreControllerMethodMiddlewareList(controllerMethodFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        controllerMethodFixture,
        controllerMethodMiddlewareMetadataReflectKey,
      );
    });

    it('should return an array', () => {
      expect(result).toBe(middlewareFixtures);
    });
  });
});
