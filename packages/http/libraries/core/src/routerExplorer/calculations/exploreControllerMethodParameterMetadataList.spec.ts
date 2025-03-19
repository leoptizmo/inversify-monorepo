import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodParameterMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodParameterMetadataReflectKey';
import { ControllerMethodParameterMetadata } from '../model/ControllerMethodParameterMetadata';
import { exploreControllerMethodParameterMetadataList } from './exploreControllerMethodParameterMetadataList';

describe(exploreControllerMethodParameterMetadataList.name, () => {
  describe('when called and getReflectMetadata returns undefined', () => {
    let controllerMethodFixture: ControllerFunction;
    let result: unknown;

    beforeAll(() => {
      controllerMethodFixture = (() => {}) as ControllerFunction;

      result = exploreControllerMethodParameterMetadataList(
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
        controllerMethodParameterMetadataReflectKey,
      );
    });

    it('should return an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when called and getReflectMetadata returns an array', () => {
    let controllerMethodFixture: ControllerFunction;
    let parameterMetadataListFixture: ControllerMethodParameterMetadata[];
    let result: unknown;

    beforeAll(() => {
      controllerMethodFixture = (() => {}) as ControllerFunction;
      parameterMetadataListFixture = [];

      vitest
        .mocked(getReflectMetadata)
        .mockReturnValueOnce(parameterMetadataListFixture);

      result = exploreControllerMethodParameterMetadataList(
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
        controllerMethodParameterMetadataReflectKey,
      );
    });

    it('should return an array', () => {
      expect(result).toBe(parameterMetadataListFixture);
    });
  });
});
