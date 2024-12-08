import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Right } from '@inversifyjs/common';

jest.mock('./resolveBindingActivations');

import {
  BindingScope,
  bindingScopeValues,
} from '../../binding/models/BindingScope';
import {
  BindingType,
  bindingTypeValues,
} from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { ResolutionParams } from '../models/ResolutionParams';
import { resolveBindingActivations } from './resolveBindingActivations';
import { resolveScoped } from './resolveScoped';

describe(resolveScoped.name, () => {
  let getBindingMock: jest.Mock<
    (arg: unknown) => ScopedBinding<BindingType, BindingScope, unknown>
  >;

  let paramsMock: jest.Mocked<ResolutionParams>;
  let argFixture: unknown;
  let resolveMock: jest.Mock<
    (params: ResolutionParams, arg: unknown) => unknown
  >;

  beforeAll(() => {
    getBindingMock = jest.fn();

    paramsMock = {
      requestScopeCache: {
        get: jest.fn(),
        has: jest.fn(),
        set: jest.fn() as unknown,
      } as Partial<jest.Mocked<Map<number, unknown>>> as jest.Mocked<
        Map<number, unknown>
      >,
    } as Partial<
      jest.Mocked<ResolutionParams>
    > as jest.Mocked<ResolutionParams>;

    argFixture = Symbol();

    resolveMock = jest.fn();
  });

  describe('when called, and getBinding() returns singleton scoped binding with cache', () => {
    let bindingFixture: ScopedBinding<
      BindingType,
      typeof bindingScopeValues.Singleton,
      unknown
    >;

    let result: unknown;

    beforeAll(() => {
      bindingFixture = bindingFixture = {
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

      getBindingMock.mockReturnValueOnce(bindingFixture);

      result = resolveScoped(getBindingMock, resolveMock)(
        paramsMock,
        argFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBinding()', () => {
      expect(getBindingMock).toHaveBeenCalledTimes(1);
      expect(getBindingMock).toHaveBeenCalledWith(argFixture);
    });

    it('should return expected result', () => {
      expect(result).toBe((bindingFixture.cache as Right<unknown>).value);
    });
  });

  describe('when called, and getBinding() returns singleton scoped binding with no cache', () => {
    let bindingFixture: ScopedBinding<
      BindingType,
      typeof bindingScopeValues.Singleton,
      unknown
    >;

    let resolveResult: unknown;
    let activatedResolveResult: unknown;

    let result: unknown;

    beforeAll(() => {
      bindingFixture = bindingFixture = {
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

      resolveResult = Symbol();
      activatedResolveResult = Symbol();

      getBindingMock.mockReturnValueOnce(bindingFixture);

      resolveMock.mockReturnValueOnce(resolveResult);
      (
        resolveBindingActivations as jest.Mock<typeof resolveBindingActivations>
      ).mockReturnValueOnce(activatedResolveResult);

      result = resolveScoped(getBindingMock, resolveMock)(
        paramsMock,
        argFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBinding()', () => {
      expect(getBindingMock).toHaveBeenCalledTimes(1);
      expect(getBindingMock).toHaveBeenCalledWith(argFixture);
    });

    it('should call resolve()', () => {
      expect(resolveMock).toHaveBeenCalledTimes(1);
      expect(resolveMock).toHaveBeenCalledWith(paramsMock, argFixture);
    });

    it('should call resolveBindingActivations()', () => {
      expect(resolveBindingActivations).toHaveBeenCalledTimes(1);
      expect(resolveBindingActivations).toHaveBeenCalledWith(
        paramsMock,
        bindingFixture.serviceIdentifier,
        resolveResult,
      );
    });

    it('should cache value', () => {
      const expectedCache: Right<unknown> = {
        isRight: true,
        value: activatedResolveResult,
      };

      expect(bindingFixture.cache).toStrictEqual(expectedCache);
    });

    it('should return expected result', () => {
      expect(result).toBe(activatedResolveResult);
    });
  });

  describe('when called, and getBinding() returns request scoped binding, and requestScopeCache.has() returns true', () => {
    let bindingFixture: ScopedBinding<
      BindingType,
      typeof bindingScopeValues.Request,
      unknown
    >;

    let resolveResult: unknown;

    let result: unknown;

    beforeAll(() => {
      bindingFixture = bindingFixture = {
        cache: {
          isRight: false,
          value: undefined,
        },
        id: 1,
        isSatisfiedBy: () => true,
        moduleId: undefined,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Request,
        serviceIdentifier: 'service-id',
        type: bindingTypeValues.ConstantValue,
      };

      resolveResult = Symbol();

      getBindingMock.mockReturnValueOnce(bindingFixture);

      paramsMock.requestScopeCache.has.mockReturnValueOnce(true);
      paramsMock.requestScopeCache.get.mockReturnValueOnce(resolveResult);

      result = resolveScoped(getBindingMock, resolveMock)(
        paramsMock,
        argFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBinding()', () => {
      expect(getBindingMock).toHaveBeenCalledTimes(1);
      expect(getBindingMock).toHaveBeenCalledWith(argFixture);
    });

    it('should call params.requestScopeCache.has()', () => {
      expect(paramsMock.requestScopeCache.has).toHaveBeenCalledTimes(1);
      expect(paramsMock.requestScopeCache.has).toHaveBeenCalledWith(
        bindingFixture.id,
      );
    });

    it('should call params.requestScopeCache.get()', () => {
      expect(paramsMock.requestScopeCache.get).toHaveBeenCalledTimes(1);
      expect(paramsMock.requestScopeCache.get).toHaveBeenCalledWith(
        bindingFixture.id,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(resolveResult);
    });
  });

  describe('when called, and getBinding() returns request scoped binding, and requestScopeCache.has() returns false', () => {
    let bindingFixture: ScopedBinding<
      BindingType,
      typeof bindingScopeValues.Request,
      unknown
    >;

    let resolveResult: unknown;
    let activatedResolveResult: unknown;

    let result: unknown;

    beforeAll(() => {
      bindingFixture = bindingFixture = {
        cache: {
          isRight: false,
          value: undefined,
        },
        id: 1,
        isSatisfiedBy: () => true,
        moduleId: undefined,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Request,
        serviceIdentifier: 'service-id',
        type: bindingTypeValues.ConstantValue,
      };

      resolveResult = Symbol();
      activatedResolveResult = Symbol();

      getBindingMock.mockReturnValueOnce(bindingFixture);

      resolveMock.mockReturnValueOnce(resolveResult);
      (
        resolveBindingActivations as jest.Mock<typeof resolveBindingActivations>
      ).mockReturnValueOnce(activatedResolveResult);

      paramsMock.requestScopeCache.has.mockReturnValueOnce(false);

      result = resolveScoped(getBindingMock, resolveMock)(
        paramsMock,
        argFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBinding()', () => {
      expect(getBindingMock).toHaveBeenCalledTimes(1);
      expect(getBindingMock).toHaveBeenCalledWith(argFixture);
    });

    it('should call params.requestScopeCache.has()', () => {
      expect(paramsMock.requestScopeCache.has).toHaveBeenCalledTimes(1);
      expect(paramsMock.requestScopeCache.has).toHaveBeenCalledWith(
        bindingFixture.id,
      );
    });

    it('should call resolve()', () => {
      expect(resolveMock).toHaveBeenCalledTimes(1);
      expect(resolveMock).toHaveBeenCalledWith(paramsMock, argFixture);
    });

    it('should call resolveBindingActivations()', () => {
      expect(resolveBindingActivations).toHaveBeenCalledTimes(1);
      expect(resolveBindingActivations).toHaveBeenCalledWith(
        paramsMock,
        bindingFixture.serviceIdentifier,
        resolveResult,
      );
    });

    it('should call params.requestScopeCache.set()', () => {
      expect(paramsMock.requestScopeCache.set).toHaveBeenCalledTimes(1);
      expect(paramsMock.requestScopeCache.set).toHaveBeenCalledWith(
        bindingFixture.id,
        activatedResolveResult,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(activatedResolveResult);
    });
  });

  describe('when called, and getBinding() returns transient scoped binding', () => {
    let bindingFixture: ScopedBinding<
      BindingType,
      typeof bindingScopeValues.Transient,
      unknown
    >;

    let resolveResult: unknown;
    let activatedResolveResult: unknown;

    let result: unknown;

    beforeAll(() => {
      bindingFixture = bindingFixture = {
        cache: {
          isRight: false,
          value: undefined,
        },
        id: 1,
        isSatisfiedBy: () => true,
        moduleId: undefined,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Transient,
        serviceIdentifier: 'service-id',
        type: bindingTypeValues.ConstantValue,
      };

      resolveResult = Symbol();
      activatedResolveResult = Symbol();

      getBindingMock.mockReturnValueOnce(bindingFixture);

      resolveMock.mockReturnValueOnce(resolveResult);
      (
        resolveBindingActivations as jest.Mock<typeof resolveBindingActivations>
      ).mockReturnValueOnce(activatedResolveResult);

      result = resolveScoped(getBindingMock, resolveMock)(
        paramsMock,
        argFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBinding()', () => {
      expect(getBindingMock).toHaveBeenCalledTimes(1);
      expect(getBindingMock).toHaveBeenCalledWith(argFixture);
    });

    it('should call resolve()', () => {
      expect(resolveMock).toHaveBeenCalledTimes(1);
      expect(resolveMock).toHaveBeenCalledWith(paramsMock, argFixture);
    });

    it('should call resolveBindingActivations()', () => {
      expect(resolveBindingActivations).toHaveBeenCalledTimes(1);
      expect(resolveBindingActivations).toHaveBeenCalledWith(
        paramsMock,
        bindingFixture.serviceIdentifier,
        resolveResult,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(activatedResolveResult);
    });
  });
});
