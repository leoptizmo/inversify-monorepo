import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';
import { Newable } from 'inversify';

import { controllerMethodMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodMiddlewareMetadataReflectKey';
import { controllerMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMiddlewareMetadataReflectKey';
import { Middleware } from '../models/Middleware';
import { applyMiddleware } from './ApplyMiddleware';

describe(applyMiddleware.name, () => {
  describe('having a ClassDecorator', () => {
    describe('when called and getReflectMetadata returns undefined', () => {
      let middlewareFixture: Newable<Middleware>;
      let targetFixture: NewableFunction;

      beforeAll(() => {
        middlewareFixture = {} as Newable<Middleware>;
        targetFixture = class TestController {};

        applyMiddleware(middlewareFixture)(targetFixture);
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

      it('should call setReflectMetadata', () => {
        expect(setReflectMetadata).toHaveBeenCalledTimes(1);
        expect(setReflectMetadata).toHaveBeenCalledWith(
          targetFixture,
          controllerMiddlewareMetadataReflectKey,
          [middlewareFixture],
        );
      });
    });
  });

  describe('having a MethodDecorator', () => {
    describe('when called and getReflectMetadata returns a Middleware list', () => {
      let middlewareFixture: Newable<Middleware>;
      let descriptorFixture: PropertyDescriptor;

      beforeAll(() => {
        middlewareFixture = {} as Newable<Middleware>;
        descriptorFixture = {
          value: 'value-descriptor-example',
        } as PropertyDescriptor;

        vitest.mocked(getReflectMetadata).mockReturnValueOnce([]);

        applyMiddleware(middlewareFixture)({}, 'key', descriptorFixture);
      });

      it('should call getReflectMetadata', () => {
        expect(getReflectMetadata).toHaveBeenCalledTimes(1);
        expect(getReflectMetadata).toHaveBeenCalledWith(
          descriptorFixture.value,
          controllerMethodMiddlewareMetadataReflectKey,
        );
      });

      it('should call setReflectMetadata', () => {
        expect(setReflectMetadata).toHaveBeenCalledTimes(1);
        expect(setReflectMetadata).toHaveBeenCalledWith(
          descriptorFixture.value,
          controllerMethodMiddlewareMetadataReflectKey,
          [middlewareFixture],
        );
      });
    });
  });
});
