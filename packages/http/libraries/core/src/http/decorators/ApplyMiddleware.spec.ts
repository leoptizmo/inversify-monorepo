import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { controllerMethodMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodMiddlewareMetadataReflectKey';
import { controllerMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMiddlewareMetadataReflectKey';
import { applyMiddleware } from './ApplyMiddleware';

describe(applyMiddleware.name, () => {
  describe('having a ClassDecorator', () => {
    describe('when called and getReflectMetadata returns undefined', () => {
      let middlewareFixture: NewableFunction;
      let targetFixture: NewableFunction;

      beforeAll(() => {
        middlewareFixture = {} as NewableFunction;
        targetFixture = class TestController {};

        applyMiddleware(middlewareFixture)(targetFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
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
      let middlewareFixture: NewableFunction;
      let descriptorFixture: PropertyDescriptor;

      beforeAll(() => {
        middlewareFixture = {} as NewableFunction;
        descriptorFixture = {
          value: 'value-descriptor-example',
        } as PropertyDescriptor;

        (
          getReflectMetadata as jest.Mock<typeof getReflectMetadata>
        ).mockReturnValueOnce([]);

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
