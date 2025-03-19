import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodStatusCodeMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodStatusCodeMetadataReflectKey';
import { exploreControllerMethodStatusCodeMetadata } from './exploreControllerMethodStatusCodeMetadata';

describe(exploreControllerMethodStatusCodeMetadata.name, () => {
  describe('when called', () => {
    let controllerMethodFixture: ControllerFunction;
    let statusCodeMetadataFixture: undefined;
    let result: unknown;

    beforeAll(() => {
      controllerMethodFixture = (() => {}) as ControllerFunction;
      statusCodeMetadataFixture = undefined;

      result = exploreControllerMethodStatusCodeMetadata(
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
        controllerMethodStatusCodeMetadataReflectKey,
      );
    });

    it('should return the controller metadata', () => {
      expect(result).toBe(statusCodeMetadataFixture);
    });
  });
});
