import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { controllerMethodHeaderMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodHeaderMetadataReflectKey';
import { setHeader } from './SetHeader';

describe(setHeader.name, () => {
  describe('when called and getReflectMetadata returns undefined', () => {
    let descriptorFixture: PropertyDescriptor;
    let keyFixture: string;
    let valueFixture: string;

    beforeAll(() => {
      descriptorFixture = {
        value: 'value-descriptor-example',
      } as PropertyDescriptor;
      keyFixture = 'key-example';
      valueFixture = 'value-example';

      setHeader(keyFixture, valueFixture)(
        {} as object,
        'key',
        descriptorFixture,
      );
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        descriptorFixture.value,
        controllerMethodHeaderMetadataReflectKey,
      );
    });

    it('should call setReflectMetadata', () => {
      expect(setReflectMetadata).toHaveBeenCalledTimes(1);
      expect(setReflectMetadata).toHaveBeenCalledWith(
        descriptorFixture.value,
        controllerMethodHeaderMetadataReflectKey,
        new Map().set(keyFixture, valueFixture),
      );
    });
  });

  describe('when called and getReflectMetadata returns a Map', () => {
    let descriptorFixture: PropertyDescriptor;
    let headerMetadataFixture: Map<string, string>;
    let keyFixture: string;
    let valueFixture: string;

    beforeAll(() => {
      descriptorFixture = {
        value: 'value-descriptor-example',
      } as PropertyDescriptor;
      headerMetadataFixture = new Map();
      keyFixture = 'key-example';
      valueFixture = 'value-example';

      vitest
        .mocked(getReflectMetadata)
        .mockReturnValueOnce(headerMetadataFixture);

      setHeader(keyFixture, valueFixture)(
        {} as object,
        'key',
        descriptorFixture,
      );
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        descriptorFixture.value,
        controllerMethodHeaderMetadataReflectKey,
      );
    });

    it('should call setReflectMetadata', () => {
      expect(setReflectMetadata).toHaveBeenCalledTimes(1);
      expect(setReflectMetadata).toHaveBeenCalledWith(
        descriptorFixture.value,
        controllerMethodHeaderMetadataReflectKey,
        headerMetadataFixture,
      );
    });
  });
});
