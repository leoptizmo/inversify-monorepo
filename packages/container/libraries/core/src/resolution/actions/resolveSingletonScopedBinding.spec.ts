import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Right } from '@inversifyjs/common';

import { bindingScopeValues } from '../../binding/models/BindingScope';
import {
  BindingType,
  bindingTypeValues,
} from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { ResolutionParams } from '../models/ResolutionParams';
import { resolveSingletonScopedBinding } from './resolveSingletonScopedBinding';

describe(resolveSingletonScopedBinding.name, () => {
  describe('having a binding with cache.isRight equals to true', () => {
    let resolutionParamsFixture: ResolutionParams;
    let bindingFixture: ScopedBinding<
      BindingType,
      typeof bindingScopeValues.Singleton,
      unknown
    >;

    let resolveMock: jest.Mock<
      (
        params: ResolutionParams,
        binding: ScopedBinding<
          BindingType,
          typeof bindingScopeValues.Singleton,
          unknown
        >,
      ) => unknown
    >;

    beforeAll(() => {
      resolutionParamsFixture = Symbol() as unknown as ResolutionParams;
      bindingFixture = {
        cache: {
          isRight: true,
          value: Symbol(),
        },
        id: 1,
        isSatisfiedBy: () => true,
        moduleId: undefined,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: 'service-id',
        type: bindingTypeValues.ConstantValue,
      };

      resolveMock = jest.fn();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = resolveSingletonScopedBinding(resolveMock)(
          resolutionParamsFixture,
          bindingFixture,
        );
      });

      it('should return cached value', () => {
        expect(result).toBe((bindingFixture.cache as Right<unknown>).value);
      });
    });
  });

  describe('having a binding with cache.isRight equals to false', () => {
    let resolutionParamsFixture: ResolutionParams;
    let bindingFixture: ScopedBinding<
      BindingType,
      typeof bindingScopeValues.Singleton,
      unknown
    >;

    let resolveMock: jest.Mock<
      (
        params: ResolutionParams,
        binding: ScopedBinding<
          BindingType,
          typeof bindingScopeValues.Singleton,
          unknown
        >,
      ) => unknown
    >;

    beforeAll(() => {
      resolutionParamsFixture = Symbol() as unknown as ResolutionParams;
      bindingFixture = {
        cache: {
          isRight: false,
          value: undefined,
        },
        id: 1,
        isSatisfiedBy: () => true,
        moduleId: undefined,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: 'service-id',
        type: bindingTypeValues.ConstantValue,
      };

      resolveMock = jest.fn();
    });

    describe('when called', () => {
      let resolveResult: unknown;

      let result: unknown;

      beforeAll(() => {
        resolveResult = Symbol();

        resolveMock.mockReturnValueOnce(resolveResult);

        result = resolveSingletonScopedBinding(resolveMock)(
          resolutionParamsFixture,
          bindingFixture,
        );
      });

      it('should call resolve()', () => {
        expect(resolveMock).toHaveBeenCalledTimes(1);
        expect(resolveMock).toHaveBeenCalledWith(
          resolutionParamsFixture,
          bindingFixture,
        );
      });

      it('should cache value', () => {
        const expectedCache: Right<unknown> = {
          isRight: true,
          value: resolveResult,
        };

        expect(bindingFixture.cache).toStrictEqual(expectedCache);
      });

      it('should return cached value', () => {
        expect(result).toBe(resolveResult);
      });
    });
  });
});
