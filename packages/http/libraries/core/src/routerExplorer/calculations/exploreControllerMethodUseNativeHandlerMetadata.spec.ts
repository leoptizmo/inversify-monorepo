import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodUseNativeHandlerMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodUseNativeHandlerMetadataReflectKey';
import { exploreControllerMethodUseNativeHandlerMetadata } from './exploreControllerMethodUseNativeHandlerMetadata';

describe(exploreControllerMethodUseNativeHandlerMetadata.name, () => {
  describe('when called and getReflectMetadata returns undefined', () => {
    let controllerMethodFixture: ControllerFunction;
    let result: unknown;

    beforeAll(() => {
      controllerMethodFixture = (() => {}) as ControllerFunction;

      result = exploreControllerMethodUseNativeHandlerMetadata(
        controllerMethodFixture,
      );
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        controllerMethodFixture,
        controllerMethodUseNativeHandlerMetadataReflectKey,
      );
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('when called and getReflectMetadata returns a boolean', () => {
    let controllerMethodFixture: ControllerFunction;
    let useNativeHandlerFixture: boolean;
    let result: unknown;

    beforeAll(() => {
      controllerMethodFixture = (() => {}) as ControllerFunction;
      useNativeHandlerFixture = false;

      vitest
        .mocked(getReflectMetadata)
        .mockReturnValueOnce(useNativeHandlerFixture);

      result = exploreControllerMethodUseNativeHandlerMetadata(
        controllerMethodFixture,
      );
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        controllerMethodFixture,
        controllerMethodUseNativeHandlerMetadataReflectKey,
      );
    });

    it('should return a boolean', () => {
      expect(result).toBe(useNativeHandlerFixture);
    });
  });
});
