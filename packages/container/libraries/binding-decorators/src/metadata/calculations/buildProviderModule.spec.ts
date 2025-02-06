import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';
import { ContainerModuleLoadOptions } from 'inversify';

import { bindingMetadataMapReflectKey } from '../../reflectMetadata/data/bindingMetadataMapReflectKey';
import { BindingMetadata } from '../models/BindingMetadata';
import { buildProviderModule } from './buildProviderModule';

describe(buildProviderModule.name, () => {
  let optionsFixture: ContainerModuleLoadOptions;

  beforeAll(() => {
    optionsFixture = {
      bind: jest.fn(),
    } as Partial<ContainerModuleLoadOptions> as ContainerModuleLoadOptions;
  });

  describe('when called, and getReflectMetadata() returns undefined', () => {
    let result: unknown;

    beforeAll(async () => {
      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(undefined);

      result = await buildProviderModule().load(optionsFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        Object,
        bindingMetadataMapReflectKey,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when called, and getReflectMetadata() returns a map with metadata', () => {
    let result: unknown;

    let bindingMetadataMock: jest.Mocked<BindingMetadata<unknown>>;

    beforeAll(async () => {
      bindingMetadataMock = {
        action: jest.fn(),
        serviceIdentifier: Symbol.for('serviceIdentifier'),
      };

      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(new Map([[Object, [bindingMetadataMock]]]));

      result = await buildProviderModule().load(optionsFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        Object,
        bindingMetadataMapReflectKey,
      );
    });

    it('should call bindingMetadata.action()', () => {
      expect(bindingMetadataMock.action).toHaveBeenCalledTimes(1);
      expect(bindingMetadataMock.action).toHaveBeenCalledWith(
        optionsFixture.bind,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
