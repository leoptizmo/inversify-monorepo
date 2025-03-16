import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';
import { Newable } from 'inversify';

import { controllerGuardMetadataReflectKey } from '../../reflectMetadata/data/controllerGuardMetadataReflectKey';
import { controllerMethodGuardMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodGuardMetadataReflectKey';
import { Guard } from '../guard/Guard';
import { useGuard } from './UseGuard';

describe(useGuard.name, () => {
  describe('having a ClassDecorator', () => {
    describe('when called and getReflectMetadata returns undefined', () => {
      let middlewareFixture: Newable<Guard>;
      let targetFixture: NewableFunction;

      beforeAll(() => {
        middlewareFixture = {} as Newable<Guard>;
        targetFixture = class TestController {};

        useGuard(middlewareFixture)(targetFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call getReflectMetadata', () => {
        expect(getReflectMetadata).toHaveBeenCalledTimes(1);
        expect(getReflectMetadata).toHaveBeenCalledWith(
          targetFixture,
          controllerGuardMetadataReflectKey,
        );
      });

      it('should call setReflectMetadata', () => {
        expect(setReflectMetadata).toHaveBeenCalledTimes(1);
        expect(setReflectMetadata).toHaveBeenCalledWith(
          targetFixture,
          controllerGuardMetadataReflectKey,
          [middlewareFixture],
        );
      });
    });
  });

  describe('having a MethodDecorator', () => {
    describe('when called and getReflectMetadata returns a Guard list', () => {
      let middlewareFixture: Newable<Guard>;
      let descriptorFixture: PropertyDescriptor;

      beforeAll(() => {
        middlewareFixture = {} as Newable<Guard>;
        descriptorFixture = {
          value: 'value-descriptor-example',
        } as PropertyDescriptor;

        vitest.mocked(getReflectMetadata).mockReturnValueOnce([]);

        useGuard(middlewareFixture)({}, 'key', descriptorFixture);
      });

      it('should call getReflectMetadata', () => {
        expect(getReflectMetadata).toHaveBeenCalledTimes(1);
        expect(getReflectMetadata).toHaveBeenCalledWith(
          descriptorFixture.value,
          controllerMethodGuardMetadataReflectKey,
        );
      });

      it('should call setReflectMetadata', () => {
        expect(setReflectMetadata).toHaveBeenCalledTimes(1);
        expect(setReflectMetadata).toHaveBeenCalledWith(
          descriptorFixture.value,
          controllerMethodGuardMetadataReflectKey,
          [middlewareFixture],
        );
      });
    });
  });
});
