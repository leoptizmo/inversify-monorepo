import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodHeaderMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodHeaderMetadataReflectKey';
import { exploreControllerMethodHeaderMetadataList } from './exploreControllerMethodHeaderMetadataList';

describe(exploreControllerMethodHeaderMetadataList.name, () => {
  describe('when called', () => {
    let controllerMethodFixture: ControllerFunction;
    let headerListFixture: [string, string][];
    let headerMetadataFixture: Map<string, string>;
    let result: unknown;

    beforeAll(() => {
      controllerMethodFixture = (() => {}) as ControllerFunction;
      headerListFixture = [['key-example', 'value-example']];
      headerMetadataFixture = new Map<string, string>(headerListFixture);

      vitest.mocked(getReflectMetadata).mockReturnValue(headerMetadataFixture);

      result = exploreControllerMethodHeaderMetadataList(
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
        controllerMethodHeaderMetadataReflectKey,
      );
    });

    it('should return a [string, string]', () => {
      expect(result).toStrictEqual(headerListFixture);
    });
  });
});
