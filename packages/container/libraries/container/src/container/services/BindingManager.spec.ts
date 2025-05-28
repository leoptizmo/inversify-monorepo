import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mocked,
  vitest,
} from 'vitest';

vitest.mock('@gritcode/inversifyjs-core');

import {
  ActivationsService,
  Binding,
  BindingConstraints,
  BindingScope,
  bindingScopeValues,
  BindingService,
  bindingTypeValues,
  DeactivationParams,
  DeactivationsService,
  GetOptionsTagConstraint,
  PlanResultCacheService,
  resolveBindingsDeactivations,
  resolveServiceDeactivations,
} from '@gritcode/inversifyjs-core';
import { ServiceIdentifier } from '@inversifyjs/common';

import { BindToFluentSyntax } from '../../binding/models/BindingFluentSyntax';
import { BindToFluentSyntaxImplementation } from '../../binding/models/BindingFluentSyntaxImplementation';
import {
  BindingIdentifier,
  bindingIdentifierSymbol,
} from '../../binding/models/BindingIdentifier';
import { BindingManager } from './BindingManager';
import { ServiceReferenceManager } from './ServiceReferenceManager';

describe(BindingManager, () => {
  let deactivationParamsFixture: DeactivationParams;
  let defaultScopeFixture: BindingScope;
  let serviceReferenceManagerMock: Mocked<ServiceReferenceManager>;

  beforeAll(() => {
    deactivationParamsFixture = Symbol() as unknown as DeactivationParams;
    defaultScopeFixture = bindingScopeValues.Transient;
    serviceReferenceManagerMock = {
      activationService: {
        removeAllByServiceId: vitest.fn(),
      } as Partial<Mocked<ActivationsService>> as Mocked<ActivationsService>,
      bindingService: {
        get: vitest.fn(),
        getById: vitest.fn(),
        getNonParentBindings: vitest.fn(),
        getNonParentBoundServices: vitest.fn(),
        removeAllByServiceId: vitest.fn(),
        removeById: vitest.fn(),
      } as Partial<Mocked<BindingService>> as Mocked<BindingService>,
      deactivationService: {
        removeAllByServiceId: vitest.fn(),
      } as Partial<
        Mocked<DeactivationsService>
      > as Mocked<DeactivationsService>,
      planResultCacheService: {
        clearCache: vitest.fn(),
      } as Partial<
        Mocked<PlanResultCacheService>
      > as Mocked<PlanResultCacheService>,
    } as Partial<
      Mocked<ServiceReferenceManager>
    > as Mocked<ServiceReferenceManager>;
  });

  describe('.bind', () => {
    describe('when called', () => {
      let serviceIdentifierFixture: ServiceIdentifier;

      let result: unknown;

      beforeAll(() => {
        serviceIdentifierFixture = 'service-id';

        result = new BindingManager(
          deactivationParamsFixture,
          defaultScopeFixture,
          serviceReferenceManagerMock,
        ).bind(serviceIdentifierFixture);
      });

      it('should return BindToFluentSyntax', () => {
        const expected: BindToFluentSyntax<unknown> =
          new BindToFluentSyntaxImplementation(
            expect.any(Function) as unknown as (
              binding: Binding<unknown>,
            ) => void,
            undefined,
            defaultScopeFixture,
            serviceIdentifierFixture,
          );

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('.isBound', () => {
    let serviceIdentifierFixture: ServiceIdentifier;

    let nameFixture: string;
    let tagFixture: GetOptionsTagConstraint;

    beforeAll(() => {
      serviceIdentifierFixture = 'service-id';

      nameFixture = 'name-fixture';
      tagFixture = {
        key: 'tag-key-fixture',
        value: Symbol(),
      };
    });

    describe('when called, and bindingService.get() returns undefined', () => {
      let result: unknown;

      beforeAll(() => {
        result = new BindingManager(
          deactivationParamsFixture,
          defaultScopeFixture,
          serviceReferenceManagerMock,
        ).isBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingService.get()', () => {
        expect(
          serviceReferenceManagerMock.bindingService.get,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.bindingService.get,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });

    describe('when called, and bindingService.get() returns binding ann binding.isSatisfiedBy() returns false', () => {
      let bindingMock: Mocked<Binding>;

      let result: unknown;

      beforeAll(() => {
        bindingMock = {
          cache: {
            isRight: false,
            value: undefined,
          },
          id: 1,
          isSatisfiedBy: vitest.fn(),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: 'service-id',
          type: bindingTypeValues.ConstantValue,
          value: Symbol.for('constant-value-binding-fixture-value'),
        };

        vitest
          .mocked(serviceReferenceManagerMock.bindingService)
          .get.mockReturnValueOnce([bindingMock]);

        bindingMock.isSatisfiedBy.mockReturnValueOnce(false);

        result = new BindingManager(
          deactivationParamsFixture,
          defaultScopeFixture,
          serviceReferenceManagerMock,
        ).isBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingService.get()', () => {
        expect(
          serviceReferenceManagerMock.bindingService.get,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.bindingService.get,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should call binding.isSatisfiedBy()', () => {
        const expectedBindingConstraints: BindingConstraints = {
          getAncestor: expect.any(Function) as unknown as () =>
            | BindingConstraints
            | undefined,
          name: nameFixture,
          serviceIdentifier: serviceIdentifierFixture,
          tags: new Map([[tagFixture.key, tagFixture.value]]),
        };

        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingConstraints,
        );
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });

    describe('when called, and bindingService.get() returns binding ann binding.isSatisfiedBy() returns true', () => {
      let bindingMock: Mocked<Binding>;

      let result: unknown;

      beforeAll(() => {
        bindingMock = {
          cache: {
            isRight: false,
            value: undefined,
          },
          id: 1,
          isSatisfiedBy: vitest.fn(),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: 'service-id',
          type: bindingTypeValues.ConstantValue,
          value: Symbol.for('constant-value-binding-fixture-value'),
        };

        vitest
          .mocked(serviceReferenceManagerMock.bindingService)
          .get.mockReturnValueOnce([bindingMock]);

        bindingMock.isSatisfiedBy.mockReturnValueOnce(true);

        result = new BindingManager(
          deactivationParamsFixture,
          defaultScopeFixture,
          serviceReferenceManagerMock,
        ).isBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingService.get()', () => {
        expect(
          serviceReferenceManagerMock.bindingService.get,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.bindingService.get,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should call binding.isSatisfiedBy()', () => {
        const expectedBindingConstraints: BindingConstraints = {
          getAncestor: expect.any(Function) as unknown as () =>
            | BindingConstraints
            | undefined,
          name: nameFixture,
          serviceIdentifier: serviceIdentifierFixture,
          tags: new Map([[tagFixture.key, tagFixture.value]]),
        };

        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingConstraints,
        );
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('.isCurrentBound', () => {
    let serviceIdentifierFixture: ServiceIdentifier;
    let nameFixture: string;
    let tagFixture: GetOptionsTagConstraint;

    beforeAll(() => {
      serviceIdentifierFixture = 'service-id';
      nameFixture = 'name-fixture';
      tagFixture = {
        key: 'tag-key-fixture',
        value: Symbol(),
      };
    });

    describe('when called, and bindingService.getNonParentBindings() returns undefined', () => {
      let result: unknown;

      beforeAll(() => {
        vitest
          .mocked(serviceReferenceManagerMock.bindingService)
          .getNonParentBindings.mockReturnValueOnce(undefined);

        result = new BindingManager(
          deactivationParamsFixture,
          defaultScopeFixture,
          serviceReferenceManagerMock,
        ).isCurrentBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingService.getNonParentBindings()', () => {
        expect(
          serviceReferenceManagerMock.bindingService.getNonParentBindings,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.bindingService.getNonParentBindings,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });

    describe('when called, and bindingService.getNonParentBindings() returns bindings and binding.isSatisfiedBy() returns false', () => {
      let bindingMock: Mocked<Binding>;

      let result: unknown;

      beforeAll(() => {
        bindingMock = {
          cache: {
            isRight: false,
            value: undefined,
          },
          id: 1,
          isSatisfiedBy: vitest.fn(),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: 'service-id',
          type: bindingTypeValues.ConstantValue,
          value: Symbol.for('constant-value-binding-fixture-value'),
        };

        vitest
          .mocked(serviceReferenceManagerMock.bindingService)
          .getNonParentBindings.mockReturnValueOnce([bindingMock]);

        bindingMock.isSatisfiedBy.mockReturnValueOnce(false);

        result = new BindingManager(
          deactivationParamsFixture,
          defaultScopeFixture,
          serviceReferenceManagerMock,
        ).isCurrentBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingService.getNonParentBindings()', () => {
        expect(
          serviceReferenceManagerMock.bindingService.getNonParentBindings,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.bindingService.getNonParentBindings,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should call binding.isSatisfiedBy()', () => {
        const expectedBindingConstraints: BindingConstraints = {
          getAncestor: expect.any(Function) as unknown as () =>
            | BindingConstraints
            | undefined,
          name: nameFixture,
          serviceIdentifier: serviceIdentifierFixture,
          tags: new Map([[tagFixture.key, tagFixture.value]]),
        };

        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingConstraints,
        );
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });

    describe('when called, and bindingService.getNonParentBindings() returns bindings and binding.isSatisfiedBy() returns true', () => {
      let bindingMock: Mocked<Binding>;

      let result: unknown;

      beforeAll(() => {
        bindingMock = {
          cache: {
            isRight: false,
            value: undefined,
          },
          id: 1,
          isSatisfiedBy: vitest.fn(),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: 'service-id',
          type: bindingTypeValues.ConstantValue,
          value: Symbol.for('constant-value-binding-fixture-value'),
        };

        vitest
          .mocked(serviceReferenceManagerMock.bindingService)
          .getNonParentBindings.mockReturnValueOnce([bindingMock]);

        bindingMock.isSatisfiedBy.mockReturnValueOnce(true);

        result = new BindingManager(
          deactivationParamsFixture,
          defaultScopeFixture,
          serviceReferenceManagerMock,
        ).isCurrentBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingService.getNonParentBindings()', () => {
        expect(
          serviceReferenceManagerMock.bindingService.getNonParentBindings,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.bindingService.getNonParentBindings,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should call binding.isSatisfiedBy()', () => {
        const expectedBindingConstraints: BindingConstraints = {
          getAncestor: expect.any(Function) as unknown as () =>
            | BindingConstraints
            | undefined,
          name: nameFixture,
          serviceIdentifier: serviceIdentifierFixture,
          tags: new Map([[tagFixture.key, tagFixture.value]]),
        };

        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingConstraints,
        );
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('.rebind', () => {
    describe('when called', () => {
      let serviceIdentifierFixture: ServiceIdentifier;

      let result: unknown;

      beforeAll(async () => {
        serviceIdentifierFixture = 'service-id';

        result = await new BindingManager(
          deactivationParamsFixture,
          defaultScopeFixture,
          serviceReferenceManagerMock,
        ).rebind(serviceIdentifierFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call resolveServiceDeactivations', () => {
        expect(resolveServiceDeactivations).toHaveBeenCalledTimes(1);
        expect(resolveServiceDeactivations).toHaveBeenCalledWith(
          deactivationParamsFixture,
          serviceIdentifierFixture,
        );
      });

      it('should call activationService.removeAllByServiceId()', () => {
        expect(
          serviceReferenceManagerMock.activationService.removeAllByServiceId,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.activationService.removeAllByServiceId,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should call bindingService.removeAllByServiceId()', () => {
        expect(
          serviceReferenceManagerMock.bindingService.removeAllByServiceId,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.bindingService.removeAllByServiceId,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should call deactivationService.removeAllByServiceId()', () => {
        expect(
          serviceReferenceManagerMock.deactivationService.removeAllByServiceId,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.deactivationService.removeAllByServiceId,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should call planResultCacheService.clearCache()', () => {
        expect(
          serviceReferenceManagerMock.planResultCacheService.clearCache,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.planResultCacheService.clearCache,
        ).toHaveBeenCalledWith();
      });

      it('should return BindToFluentSyntax', () => {
        const expected: BindToFluentSyntax<unknown> =
          new BindToFluentSyntaxImplementation(
            expect.any(Function) as unknown as (
              binding: Binding<unknown>,
            ) => void,
            undefined,
            bindingScopeValues.Singleton,
            serviceIdentifierFixture,
          );

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('.rebindSync', () => {
    describe('when called', () => {
      let serviceIdentifierFixture: ServiceIdentifier;

      let result: unknown;

      beforeAll(async () => {
        serviceIdentifierFixture = 'service-id';

        result = new BindingManager(
          deactivationParamsFixture,
          defaultScopeFixture,
          serviceReferenceManagerMock,
        ).rebindSync(serviceIdentifierFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call resolveServiceDeactivations', () => {
        expect(resolveServiceDeactivations).toHaveBeenCalledTimes(1);
        expect(resolveServiceDeactivations).toHaveBeenCalledWith(
          deactivationParamsFixture,
          serviceIdentifierFixture,
        );
      });

      it('should call activationService.removeAllByServiceId()', () => {
        expect(
          serviceReferenceManagerMock.activationService.removeAllByServiceId,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.activationService.removeAllByServiceId,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should call bindingService.removeAllByServiceId()', () => {
        expect(
          serviceReferenceManagerMock.bindingService.removeAllByServiceId,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.bindingService.removeAllByServiceId,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should call deactivationService.removeAllByServiceId()', () => {
        expect(
          serviceReferenceManagerMock.deactivationService.removeAllByServiceId,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.deactivationService.removeAllByServiceId,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should call planResultCacheService.clearCache()', () => {
        expect(
          serviceReferenceManagerMock.planResultCacheService.clearCache,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.planResultCacheService.clearCache,
        ).toHaveBeenCalledWith();
      });

      it('should return BindToFluentSyntax', () => {
        const expected: BindToFluentSyntax<unknown> =
          new BindToFluentSyntaxImplementation(
            expect.any(Function) as unknown as (
              binding: Binding<unknown>,
            ) => void,
            undefined,
            bindingScopeValues.Singleton,
            serviceIdentifierFixture,
          );

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('.unbind', () => {
    describe('having a ServiceIdentifier', () => {
      let serviceIdentifierFixture: ServiceIdentifier;

      beforeAll(() => {
        serviceIdentifierFixture = 'serviceId';
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          result = await new BindingManager(
            deactivationParamsFixture,
            defaultScopeFixture,
            serviceReferenceManagerMock,
          ).unbind(serviceIdentifierFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call resolveServiceDeactivations()', () => {
          expect(resolveServiceDeactivations).toHaveBeenCalledTimes(1);
          expect(resolveServiceDeactivations).toHaveBeenCalledWith(
            deactivationParamsFixture,
            serviceIdentifierFixture,
          );
        });

        it('should call activationService.removeAllByServiceId()', () => {
          expect(
            serviceReferenceManagerMock.activationService.removeAllByServiceId,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.activationService.removeAllByServiceId,
          ).toHaveBeenCalledWith(serviceIdentifierFixture);
        });

        it('should call bindingService.removeAllByServiceId()', () => {
          expect(
            serviceReferenceManagerMock.bindingService.removeAllByServiceId,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.bindingService.removeAllByServiceId,
          ).toHaveBeenCalledWith(serviceIdentifierFixture);
        });

        it('should call deactivationService.removeAllByServiceId()', () => {
          expect(
            serviceReferenceManagerMock.deactivationService
              .removeAllByServiceId,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.deactivationService
              .removeAllByServiceId,
          ).toHaveBeenCalledWith(serviceIdentifierFixture);
        });

        it('should call planResultCacheService.clearCache()', () => {
          expect(
            serviceReferenceManagerMock.planResultCacheService.clearCache,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.planResultCacheService.clearCache,
          ).toHaveBeenCalledWith();
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });

      describe('when called, and resolveServiceDeactivations() returns Promise', () => {
        let result: unknown;

        beforeAll(async () => {
          vitest
            .mocked(resolveServiceDeactivations)
            .mockResolvedValueOnce(undefined);

          result = await new BindingManager(
            deactivationParamsFixture,
            defaultScopeFixture,
            serviceReferenceManagerMock,
          ).unbind(serviceIdentifierFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call resolveServiceDeactivations()', () => {
          expect(resolveServiceDeactivations).toHaveBeenCalledTimes(1);
          expect(resolveServiceDeactivations).toHaveBeenCalledWith(
            deactivationParamsFixture,
            serviceIdentifierFixture,
          );
        });

        it('should call activationService.removeAllByServiceId()', () => {
          expect(
            serviceReferenceManagerMock.activationService.removeAllByServiceId,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.activationService.removeAllByServiceId,
          ).toHaveBeenCalledWith(serviceIdentifierFixture);
        });

        it('should call bindingService.removeAllByServiceId()', () => {
          expect(
            serviceReferenceManagerMock.bindingService.removeAllByServiceId,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.bindingService.removeAllByServiceId,
          ).toHaveBeenCalledWith(serviceIdentifierFixture);
        });

        it('should call deactivationService.removeAllByServiceId()', () => {
          expect(
            serviceReferenceManagerMock.deactivationService
              .removeAllByServiceId,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.deactivationService
              .removeAllByServiceId,
          ).toHaveBeenCalledWith(serviceIdentifierFixture);
        });

        it('should call planResultCacheService.clearCache()', () => {
          expect(
            serviceReferenceManagerMock.planResultCacheService.clearCache,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.planResultCacheService.clearCache,
          ).toHaveBeenCalledWith();
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('having a BindingIdentifier', () => {
      let bindingIdentifierFixture: BindingIdentifier;

      beforeAll(() => {
        bindingIdentifierFixture = {
          [bindingIdentifierSymbol]: true,
          id: 1,
        };
      });

      describe('when called', () => {
        let bindingMock: Mocked<Binding>;
        let result: unknown;

        beforeAll(async () => {
          bindingMock = {
            cache: {
              isRight: false,
              value: undefined,
            },
            id: bindingIdentifierFixture.id,
            isSatisfiedBy: vitest.fn(),
            moduleId: undefined,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: bindingScopeValues.Singleton,
            serviceIdentifier: 'service-id',
            type: bindingTypeValues.ConstantValue,
            value: Symbol.for('constant-value-binding-fixture-value'),
          };

          vitest
            .mocked(serviceReferenceManagerMock.bindingService)
            .getById.mockReturnValueOnce([bindingMock]);

          result = await new BindingManager(
            deactivationParamsFixture,
            defaultScopeFixture,
            serviceReferenceManagerMock,
          ).unbind(bindingIdentifierFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call bindingService.getById()', () => {
          expect(
            serviceReferenceManagerMock.bindingService.getById,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.bindingService.getById,
          ).toHaveBeenCalledWith(bindingIdentifierFixture.id);
        });

        it('should call resolveBindingsDeactivations()', () => {
          expect(resolveBindingsDeactivations).toHaveBeenCalledTimes(1);
          expect(resolveBindingsDeactivations).toHaveBeenCalledWith(
            deactivationParamsFixture,
            [bindingMock],
          );
        });

        it('should call bindingService.removeById()', () => {
          expect(
            serviceReferenceManagerMock.bindingService.removeById,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.bindingService.removeById,
          ).toHaveBeenCalledWith(bindingIdentifierFixture.id);
        });

        it('should call planResultCacheService.clearCache()', () => {
          expect(
            serviceReferenceManagerMock.planResultCacheService.clearCache,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.planResultCacheService.clearCache,
          ).toHaveBeenCalledWith();
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });

      describe('when called, and resolveBindingsDeactivations() returns a Promise', () => {
        let bindingMock: Mocked<Binding>;
        let result: unknown;

        beforeAll(async () => {
          bindingMock = {
            cache: {
              isRight: false,
              value: undefined,
            },
            id: bindingIdentifierFixture.id,
            isSatisfiedBy: vitest.fn(),
            moduleId: undefined,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: bindingScopeValues.Singleton,
            serviceIdentifier: 'service-id',
            type: bindingTypeValues.ConstantValue,
            value: Symbol.for('constant-value-binding-fixture-value'),
          };

          vitest
            .mocked(serviceReferenceManagerMock.bindingService)
            .getById.mockReturnValueOnce([bindingMock]);

          vitest
            .mocked(resolveBindingsDeactivations)
            .mockResolvedValueOnce(undefined);

          result = await new BindingManager(
            deactivationParamsFixture,
            defaultScopeFixture,
            serviceReferenceManagerMock,
          ).unbind(bindingIdentifierFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call bindingService.getById()', () => {
          expect(
            serviceReferenceManagerMock.bindingService.getById,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.bindingService.getById,
          ).toHaveBeenCalledWith(bindingIdentifierFixture.id);
        });

        it('should call resolveBindingsDeactivations()', () => {
          expect(resolveBindingsDeactivations).toHaveBeenCalledTimes(1);
          expect(resolveBindingsDeactivations).toHaveBeenCalledWith(
            deactivationParamsFixture,
            [bindingMock],
          );
        });

        it('should call bindingService.removeById()', () => {
          expect(
            serviceReferenceManagerMock.bindingService.removeById,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.bindingService.removeById,
          ).toHaveBeenCalledWith(bindingIdentifierFixture.id);
        });

        it('should call planResultCacheService.clearCache()', () => {
          expect(
            serviceReferenceManagerMock.planResultCacheService.clearCache,
          ).toHaveBeenCalledTimes(1);
          expect(
            serviceReferenceManagerMock.planResultCacheService.clearCache,
          ).toHaveBeenCalledWith();
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });

  describe('.unbindAll', () => {
    describe('when called', () => {
      let serviceIdsFixture: string[];
      let result: unknown;

      beforeAll(async () => {
        serviceIdsFixture = ['service1', 'service2'];
        vitest
          .mocked(serviceReferenceManagerMock.bindingService)
          .getNonParentBoundServices.mockReturnValueOnce(serviceIdsFixture);

        result = await new BindingManager(
          deactivationParamsFixture,
          defaultScopeFixture,
          serviceReferenceManagerMock,
        ).unbindAll();
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call resolveServiceDeactivations for each service', () => {
        expect(resolveServiceDeactivations).toHaveBeenCalledTimes(
          serviceIdsFixture.length,
        );

        for (const serviceId of serviceIdsFixture) {
          expect(resolveServiceDeactivations).toHaveBeenCalledWith(
            deactivationParamsFixture,
            serviceId,
          );
        }
      });

      it('should call removeAllByServiceId on activationService for each service', () => {
        expect(
          serviceReferenceManagerMock.activationService.removeAllByServiceId,
        ).toHaveBeenCalledTimes(serviceIdsFixture.length);

        for (const serviceId of serviceIdsFixture) {
          expect(
            serviceReferenceManagerMock.activationService.removeAllByServiceId,
          ).toHaveBeenCalledWith(serviceId);
        }
      });

      it('should call removeAllByServiceId on bindingService for each service', () => {
        expect(
          serviceReferenceManagerMock.bindingService.removeAllByServiceId,
        ).toHaveBeenCalledTimes(serviceIdsFixture.length);

        for (const serviceId of serviceIdsFixture) {
          expect(
            serviceReferenceManagerMock.bindingService.removeAllByServiceId,
          ).toHaveBeenCalledWith(serviceId);
        }
      });

      it('should call removeAllByServiceId on deactivationService for each service', () => {
        expect(
          serviceReferenceManagerMock.deactivationService.removeAllByServiceId,
        ).toHaveBeenCalledTimes(serviceIdsFixture.length);

        for (const serviceId of serviceIdsFixture) {
          expect(
            serviceReferenceManagerMock.deactivationService
              .removeAllByServiceId,
          ).toHaveBeenCalledWith(serviceId);
        }
      });

      it('should call planResultCacheService.clearCache()', () => {
        expect(
          serviceReferenceManagerMock.planResultCacheService.clearCache,
        ).toHaveBeenCalledTimes(1);
        expect(
          serviceReferenceManagerMock.planResultCacheService.clearCache,
        ).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
