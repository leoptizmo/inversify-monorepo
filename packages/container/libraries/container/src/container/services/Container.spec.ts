import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/core');

import { Newable, ServiceIdentifier } from '@inversifyjs/common';
import {
  ActivationsService,
  Binding,
  BindingActivation,
  BindingActivationRelation,
  BindingDeactivation,
  BindingDeactivationRelation,
  BindingMetadata,
  BindingScope,
  bindingScopeValues,
  BindingService,
  bindingTypeValues,
  ClassMetadata,
  DeactivationParams,
  DeactivationsService,
  getClassMetadata,
  GetOptions,
  GetOptionsTagConstraint,
  plan,
  PlanParams,
  PlanResult,
  ResolutionContext,
  ResolutionParams,
  resolve,
  resolveModuleDeactivations,
  resolveServiceDeactivations,
} from '@inversifyjs/core';

import { BindToFluentSyntax } from '../../binding/models/BindingFluentSyntax';
import { BindToFluentSyntaxImplementation } from '../../binding/models/BindingFluentSyntaxImplementation';
import { InversifyContainerError } from '../../error/models/InversifyContainerError';
import { InversifyContainerErrorKind } from '../../error/models/InversifyContainerErrorKind';
import {
  ContainerModule,
  ContainerModuleLoadOptions,
} from '../models/ContainerModule';
import { IsBoundOptions } from '../models/isBoundOptions';
import { Container } from './Container';

describe(Container.name, () => {
  let activationServiceMock: jest.Mocked<ActivationsService>;
  let bindingServiceMock: jest.Mocked<BindingService>;
  let deactivationServiceMock: jest.Mocked<DeactivationsService>;

  beforeAll(() => {
    activationServiceMock = {
      add: jest.fn(),
      removeAllByModuleId: jest.fn(),
      removeAllByServiceId: jest.fn(),
    } as Partial<
      jest.Mocked<ActivationsService>
    > as jest.Mocked<ActivationsService>;
    bindingServiceMock = {
      get: jest.fn(),
      removeAllByModuleId: jest.fn(),
      removeAllByServiceId: jest.fn(),
      set: jest.fn(),
    } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;
    deactivationServiceMock = {
      add: jest.fn(),
      removeAllByModuleId: jest.fn(),
      removeAllByServiceId: jest.fn(),
    } as Partial<
      jest.Mocked<DeactivationsService>
    > as jest.Mocked<DeactivationsService>;

    (ActivationsService as jest.Mock<() => ActivationsService>).mockReturnValue(
      activationServiceMock,
    );
    (BindingService as jest.Mock<() => BindingService>).mockReturnValue(
      bindingServiceMock,
    );
    (
      DeactivationsService as jest.Mock<() => DeactivationsService>
    ).mockReturnValue(deactivationServiceMock);
  });

  describe('.constructor', () => {
    describe('having a parent container', () => {
      let parentContainerFixture: Container;

      beforeAll(() => {
        parentContainerFixture = new Container();
      });

      describe('when called', () => {
        beforeAll(() => {
          new Container({
            parent: parentContainerFixture,
          });
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call new ActivationsService', () => {
          expect(ActivationsService).toHaveBeenCalledTimes(2);
          expect(ActivationsService).toHaveBeenNthCalledWith(1, undefined);
          expect(ActivationsService).toHaveBeenNthCalledWith(
            2,
            activationServiceMock,
          );
        });

        it('should call new BindingService', () => {
          expect(BindingService).toHaveBeenCalledTimes(2);
          expect(BindingService).toHaveBeenNthCalledWith(1, undefined);
          expect(BindingService).toHaveBeenNthCalledWith(2, bindingServiceMock);
        });

        it('should call new DeactivationsService', () => {
          expect(DeactivationsService).toHaveBeenCalledTimes(2);
          expect(DeactivationsService).toHaveBeenNthCalledWith(1, undefined);
          expect(DeactivationsService).toHaveBeenNthCalledWith(
            2,
            deactivationServiceMock,
          );
        });
      });
    });
  });

  describe('.bind', () => {
    describe('when called', () => {
      let bindingScopeFixture: BindingScope;
      let serviceIdentifierFixture: ServiceIdentifier;

      let result: unknown;

      beforeAll(() => {
        bindingScopeFixture = bindingScopeValues.Singleton;
        serviceIdentifierFixture = 'service-id';

        result = new Container().bind(serviceIdentifierFixture);
      });

      it('should return BindToFluentSyntax', () => {
        const expected: BindToFluentSyntax<unknown> =
          new BindToFluentSyntaxImplementation(
            expect.any(Function) as unknown as (
              binding: Binding<unknown>,
            ) => void,
            undefined,
            bindingScopeFixture,
            serviceIdentifierFixture,
          );

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('.get', () => {
    describe('when called', () => {
      let serviceIdentifierFixture: ServiceIdentifier;
      let getOptionsFixture: GetOptions;

      let planResultFixture: PlanResult;

      let resolvedValueFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        serviceIdentifierFixture = 'service-id';
        getOptionsFixture = {
          name: 'name',
          optional: true,
          tag: {
            key: 'tag-key',
            value: Symbol(),
          },
        };

        planResultFixture = Symbol() as unknown as PlanResult;

        resolvedValueFixture = Symbol();

        (plan as jest.Mock<typeof plan>).mockReturnValueOnce(planResultFixture);

        (resolve as jest.Mock<typeof resolve>).mockReturnValueOnce(
          resolvedValueFixture,
        );

        result = new Container().get(
          serviceIdentifierFixture,
          getOptionsFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call plan()', () => {
        const expectedPlanParams: PlanParams = {
          getBindings: expect.any(Function) as unknown as <TInstance>(
            serviceIdentifier: ServiceIdentifier<TInstance>,
          ) => Binding<TInstance>[] | undefined,
          getClassMetadata,
          rootConstraints: {
            isMultiple: false,
            isOptional: getOptionsFixture.optional as true,
            name: getOptionsFixture.name as string,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag as GetOptionsTagConstraint,
          },
          servicesBranch: new Set(),
        };

        expect(plan).toHaveBeenCalledTimes(1);
        expect(plan).toHaveBeenCalledWith(expectedPlanParams);
      });

      it('should call resolve()', () => {
        const expectedResolveParams: ResolutionParams = {
          context: {
            get: expect.any(Function),
            getAll: expect.any(Function),
            getAllAsync: expect.any(Function),
            getAsync: expect.any(Function),
          } as unknown as ResolutionContext,
          getActivations: expect.any(Function) as unknown as <TActivated>(
            serviceIdentifier: ServiceIdentifier<TActivated>,
          ) => Iterable<BindingActivation<TActivated>> | undefined,
          planResult: planResultFixture,
          requestScopeCache: new Map(),
        };

        expect(resolve).toHaveBeenCalledTimes(1);
        expect(resolve).toHaveBeenCalledWith(expectedResolveParams);
      });

      it('should return expected value', () => {
        expect(result).toBe(resolvedValueFixture);
      });
    });

    describe('when called, and resolve returns Promise', () => {
      let serviceIdentifierFixture: ServiceIdentifier;
      let getOptionsFixture: GetOptions;

      let planResultFixture: PlanResult;

      let resolvedValueFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        serviceIdentifierFixture = 'service-id';
        getOptionsFixture = {
          name: 'name',
          optional: true,
          tag: {
            key: 'tag-key',
            value: Symbol(),
          },
        };

        planResultFixture = Symbol() as unknown as PlanResult;

        resolvedValueFixture = Symbol();

        (plan as jest.Mock<typeof plan>).mockReturnValueOnce(planResultFixture);

        (resolve as jest.Mock<typeof resolve>).mockReturnValueOnce(
          Promise.resolve(resolvedValueFixture),
        );

        try {
          new Container().get(serviceIdentifierFixture, getOptionsFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call plan()', () => {
        const expectedPlanParams: PlanParams = {
          getBindings: expect.any(Function) as unknown as <TInstance>(
            serviceIdentifier: ServiceIdentifier<TInstance>,
          ) => Binding<TInstance>[] | undefined,
          getClassMetadata,
          rootConstraints: {
            isMultiple: false,
            isOptional: getOptionsFixture.optional as true,
            name: getOptionsFixture.name as string,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag as GetOptionsTagConstraint,
          },
          servicesBranch: new Set(),
        };

        expect(plan).toHaveBeenCalledTimes(1);
        expect(plan).toHaveBeenCalledWith(expectedPlanParams);
      });

      it('should call resolve()', () => {
        const expectedResolveParams: ResolutionParams = {
          context: {
            get: expect.any(Function),
            getAll: expect.any(Function),
            getAllAsync: expect.any(Function),
            getAsync: expect.any(Function),
          } as unknown as ResolutionContext,
          getActivations: expect.any(Function) as unknown as <TActivated>(
            serviceIdentifier: ServiceIdentifier<TActivated>,
          ) => Iterable<BindingActivation<TActivated>> | undefined,
          planResult: planResultFixture,
          requestScopeCache: new Map(),
        };

        expect(resolve).toHaveBeenCalledTimes(1);
        expect(resolve).toHaveBeenCalledWith(expectedResolveParams);
      });

      it('should throw an InversifyContainerError', () => {
        const expectedErrorProperties: Partial<InversifyContainerError> = {
          kind: InversifyContainerErrorKind.invalidOperation,
          message: `Unexpected asyncronous service when resolving service "${serviceIdentifierFixture as string}"`,
        };

        expect(result).toBeInstanceOf(InversifyContainerError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('.getAll', () => {
    describe('when called', () => {
      let serviceIdentifierFixture: ServiceIdentifier;
      let getOptionsFixture: GetOptions;

      let planResultFixture: PlanResult;

      let resolvedValueFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        serviceIdentifierFixture = 'service-id';
        getOptionsFixture = {
          name: 'name',
          optional: true,
          tag: {
            key: 'tag-key',
            value: Symbol(),
          },
        };

        planResultFixture = Symbol() as unknown as PlanResult;

        resolvedValueFixture = Symbol();

        (plan as jest.Mock<typeof plan>).mockReturnValueOnce(planResultFixture);

        (resolve as jest.Mock<typeof resolve>).mockReturnValueOnce([
          resolvedValueFixture,
        ]);

        result = new Container().getAll(
          serviceIdentifierFixture,
          getOptionsFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call plan()', () => {
        const expectedPlanParams: PlanParams = {
          getBindings: expect.any(Function) as unknown as <TInstance>(
            serviceIdentifier: ServiceIdentifier<TInstance>,
          ) => Binding<TInstance>[] | undefined,
          getClassMetadata,
          rootConstraints: {
            isMultiple: true,
            isOptional: getOptionsFixture.optional as true,
            name: getOptionsFixture.name as string,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag as GetOptionsTagConstraint,
          },
          servicesBranch: new Set(),
        };

        expect(plan).toHaveBeenCalledTimes(1);
        expect(plan).toHaveBeenCalledWith(expectedPlanParams);
      });

      it('should call resolve()', () => {
        const expectedResolveParams: ResolutionParams = {
          context: {
            get: expect.any(Function),
            getAll: expect.any(Function),
            getAllAsync: expect.any(Function),
            getAsync: expect.any(Function),
          } as unknown as ResolutionContext,
          getActivations: expect.any(Function) as unknown as <TActivated>(
            serviceIdentifier: ServiceIdentifier<TActivated>,
          ) => Iterable<BindingActivation<TActivated>> | undefined,
          planResult: planResultFixture,
          requestScopeCache: new Map(),
        };

        expect(resolve).toHaveBeenCalledTimes(1);
        expect(resolve).toHaveBeenCalledWith(expectedResolveParams);
      });

      it('should return expected value', () => {
        expect(result).toStrictEqual([resolvedValueFixture]);
      });
    });

    describe('when called, and resolve returns Promise', () => {
      let serviceIdentifierFixture: ServiceIdentifier;
      let getOptionsFixture: GetOptions;

      let planResultFixture: PlanResult;

      let resolvedValueFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        serviceIdentifierFixture = 'service-id';
        getOptionsFixture = {
          name: 'name',
          optional: true,
          tag: {
            key: 'tag-key',
            value: Symbol(),
          },
        };

        planResultFixture = Symbol() as unknown as PlanResult;

        resolvedValueFixture = Symbol();

        (plan as jest.Mock<typeof plan>).mockReturnValueOnce(planResultFixture);

        (resolve as jest.Mock<typeof resolve>).mockReturnValueOnce(
          Promise.resolve([resolvedValueFixture]),
        );

        try {
          new Container().getAll(serviceIdentifierFixture, getOptionsFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call plan()', () => {
        const expectedPlanParams: PlanParams = {
          getBindings: expect.any(Function) as unknown as <TInstance>(
            serviceIdentifier: ServiceIdentifier<TInstance>,
          ) => Binding<TInstance>[] | undefined,
          getClassMetadata,
          rootConstraints: {
            isMultiple: true,
            isOptional: getOptionsFixture.optional as true,
            name: getOptionsFixture.name as string,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag as GetOptionsTagConstraint,
          },
          servicesBranch: new Set(),
        };

        expect(plan).toHaveBeenCalledTimes(1);
        expect(plan).toHaveBeenCalledWith(expectedPlanParams);
      });

      it('should call resolve()', () => {
        const expectedResolveParams: ResolutionParams = {
          context: {
            get: expect.any(Function),
            getAll: expect.any(Function),
            getAllAsync: expect.any(Function),
            getAsync: expect.any(Function),
          } as unknown as ResolutionContext,
          getActivations: expect.any(Function) as unknown as <TActivated>(
            serviceIdentifier: ServiceIdentifier<TActivated>,
          ) => Iterable<BindingActivation<TActivated>> | undefined,
          planResult: planResultFixture,
          requestScopeCache: new Map(),
        };

        expect(resolve).toHaveBeenCalledTimes(1);
        expect(resolve).toHaveBeenCalledWith(expectedResolveParams);
      });

      it('should throw an InversifyContainerError', () => {
        const expectedErrorProperties: Partial<InversifyContainerError> = {
          kind: InversifyContainerErrorKind.invalidOperation,
          message: `Unexpected asyncronous service when resolving service "${serviceIdentifierFixture as string}"`,
        };

        expect(result).toBeInstanceOf(InversifyContainerError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('.getAllAsync', () => {
    describe('when called', () => {
      let serviceIdentifierFixture: ServiceIdentifier;
      let getOptionsFixture: GetOptions;

      let planResultFixture: PlanResult;

      let resolvedValueFixture: unknown;

      let result: unknown;

      beforeAll(async () => {
        serviceIdentifierFixture = 'service-id';
        getOptionsFixture = {
          name: 'name',
          optional: true,
          tag: {
            key: 'tag-key',
            value: Symbol(),
          },
        };

        planResultFixture = Symbol() as unknown as PlanResult;

        resolvedValueFixture = Symbol();

        (plan as jest.Mock<typeof plan>).mockReturnValueOnce(planResultFixture);

        (resolve as jest.Mock<typeof resolve>).mockReturnValueOnce([
          resolvedValueFixture,
        ]);

        result = await new Container().getAllAsync(
          serviceIdentifierFixture,
          getOptionsFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call plan()', () => {
        const expectedPlanParams: PlanParams = {
          getBindings: expect.any(Function) as unknown as <TInstance>(
            serviceIdentifier: ServiceIdentifier<TInstance>,
          ) => Binding<TInstance>[] | undefined,
          getClassMetadata,
          rootConstraints: {
            isMultiple: true,
            isOptional: getOptionsFixture.optional as true,
            name: getOptionsFixture.name as string,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag as GetOptionsTagConstraint,
          },
          servicesBranch: new Set(),
        };

        expect(plan).toHaveBeenCalledTimes(1);
        expect(plan).toHaveBeenCalledWith(expectedPlanParams);
      });

      it('should call resolve()', () => {
        const expectedResolveParams: ResolutionParams = {
          context: {
            get: expect.any(Function),
            getAll: expect.any(Function),
            getAllAsync: expect.any(Function),
            getAsync: expect.any(Function),
          } as unknown as ResolutionContext,
          getActivations: expect.any(Function) as unknown as <TActivated>(
            serviceIdentifier: ServiceIdentifier<TActivated>,
          ) => Iterable<BindingActivation<TActivated>> | undefined,
          planResult: planResultFixture,
          requestScopeCache: new Map(),
        };

        expect(resolve).toHaveBeenCalledTimes(1);
        expect(resolve).toHaveBeenCalledWith(expectedResolveParams);
      });

      it('should return expected value', () => {
        expect(result).toStrictEqual([resolvedValueFixture]);
      });
    });
  });

  describe('.getAsync', () => {
    describe('when called', () => {
      let serviceIdentifierFixture: ServiceIdentifier;
      let getOptionsFixture: GetOptions;

      let planResultFixture: PlanResult;

      let resolvedValueFixture: unknown;

      let result: unknown;

      beforeAll(async () => {
        serviceIdentifierFixture = 'service-id';
        getOptionsFixture = {
          name: 'name',
          optional: true,
          tag: {
            key: 'tag-key',
            value: Symbol(),
          },
        };

        planResultFixture = Symbol() as unknown as PlanResult;

        resolvedValueFixture = Symbol();

        (plan as jest.Mock<typeof plan>).mockReturnValueOnce(planResultFixture);

        (resolve as jest.Mock<typeof resolve>).mockReturnValueOnce(
          resolvedValueFixture,
        );

        result = await new Container().getAsync(
          serviceIdentifierFixture,
          getOptionsFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call plan()', () => {
        const expectedPlanParams: PlanParams = {
          getBindings: expect.any(Function) as unknown as <TInstance>(
            serviceIdentifier: ServiceIdentifier<TInstance>,
          ) => Binding<TInstance>[] | undefined,
          getClassMetadata,
          rootConstraints: {
            isMultiple: false,
            isOptional: getOptionsFixture.optional as true,
            name: getOptionsFixture.name as string,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag as GetOptionsTagConstraint,
          },
          servicesBranch: new Set(),
        };

        expect(plan).toHaveBeenCalledTimes(1);
        expect(plan).toHaveBeenCalledWith(expectedPlanParams);
      });

      it('should call resolve()', () => {
        const expectedResolveParams: ResolutionParams = {
          context: {
            get: expect.any(Function),
            getAll: expect.any(Function),
            getAllAsync: expect.any(Function),
            getAsync: expect.any(Function),
          } as unknown as ResolutionContext,
          getActivations: expect.any(Function) as unknown as <TActivated>(
            serviceIdentifier: ServiceIdentifier<TActivated>,
          ) => Iterable<BindingActivation<TActivated>> | undefined,
          planResult: planResultFixture,
          requestScopeCache: new Map(),
        };

        expect(resolve).toHaveBeenCalledTimes(1);
        expect(resolve).toHaveBeenCalledWith(expectedResolveParams);
      });

      it('should return expected value', () => {
        expect(result).toBe(resolvedValueFixture);
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
        result = new Container().isBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bindingService.get()', () => {
        expect(bindingServiceMock.get).toHaveBeenCalledTimes(1);
        expect(bindingServiceMock.get).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });

    describe('when called, and bindingService.get() returns binding ann binding.isSatisfiedBy() returns false', () => {
      let bindingMock: jest.Mocked<Binding>;

      let result: unknown;

      beforeAll(() => {
        bindingMock = {
          cache: {
            isRight: false,
            value: undefined,
          },
          id: 1,
          isSatisfiedBy: jest.fn(),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: 'service-id',
          type: bindingTypeValues.ConstantValue,
          value: Symbol.for('constant-value-binding-fixture-value'),
        };

        bindingServiceMock.get.mockReturnValueOnce([bindingMock]);

        bindingMock.isSatisfiedBy.mockReturnValueOnce(false);

        result = new Container().isBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bindingService.get()', () => {
        expect(bindingServiceMock.get).toHaveBeenCalledTimes(1);
        expect(bindingServiceMock.get).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call binding.isSatisfiedBy()', () => {
        const expectedBindingMetadata: BindingMetadata = {
          getAncestor: expect.any(Function) as unknown as () =>
            | BindingMetadata
            | undefined,
          name: nameFixture,
          serviceIdentifier: serviceIdentifierFixture,
          tags: new Map([[tagFixture.key, tagFixture.value]]),
        };

        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata,
        );
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });

    describe('when called, and bindingService.get() returns binding ann binding.isSatisfiedBy() returns true', () => {
      let bindingMock: jest.Mocked<Binding>;

      let result: unknown;

      beforeAll(() => {
        bindingMock = {
          cache: {
            isRight: false,
            value: undefined,
          },
          id: 1,
          isSatisfiedBy: jest.fn(),
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: 'service-id',
          type: bindingTypeValues.ConstantValue,
          value: Symbol.for('constant-value-binding-fixture-value'),
        };

        bindingServiceMock.get.mockReturnValueOnce([bindingMock]);

        bindingMock.isSatisfiedBy.mockReturnValueOnce(true);

        result = new Container().isBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call bindingService.get()', () => {
        expect(bindingServiceMock.get).toHaveBeenCalledTimes(1);
        expect(bindingServiceMock.get).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call binding.isSatisfiedBy()', () => {
        const expectedBindingMetadata: BindingMetadata = {
          getAncestor: expect.any(Function) as unknown as () =>
            | BindingMetadata
            | undefined,
          name: nameFixture,
          serviceIdentifier: serviceIdentifierFixture,
          tags: new Map([[tagFixture.key, tagFixture.value]]),
        };

        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledTimes(1);
        expect(bindingMock.isSatisfiedBy).toHaveBeenCalledWith(
          expectedBindingMetadata,
        );
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('.load', () => {
    let containerModuleMock: jest.Mocked<ContainerModule>;

    beforeAll(() => {
      containerModuleMock = {
        load: jest.fn(),
      } as Partial<
        jest.Mocked<ContainerModule>
      > as jest.Mocked<ContainerModule>;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        result = await new Container().load(containerModuleMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerModuler.load', () => {
        const options: ContainerModuleLoadOptions = {
          bind: expect.any(Function) as unknown as <T>(
            serviceIdentifier: ServiceIdentifier<T>,
          ) => BindToFluentSyntax<T>,
          isBound: expect.any(Function) as unknown as (
            serviceIdentifier: ServiceIdentifier,
            options?: IsBoundOptions,
          ) => boolean,
          onActivation: expect.any(Function) as unknown as <T>(
            serviceIdentifier: ServiceIdentifier<T>,
            activation: BindingActivation<T>,
          ) => void,
          onDeactivation: expect.any(Function) as unknown as <T>(
            serviceIdentifier: ServiceIdentifier<T>,
            activation: BindingDeactivation<T>,
          ) => void,
          unbind: expect.any(Function) as unknown as (
            serviceIdentifier: ServiceIdentifier,
          ) => Promise<void>,
        };

        expect(containerModuleMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleMock.load).toHaveBeenCalledWith(options);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.onActivation', () => {
    let serviceIdentifierFixture: ServiceIdentifier;
    let activationMock: jest.Mock<BindingActivation>;

    beforeAll(() => {
      serviceIdentifierFixture = 'service-id';
      activationMock = jest.fn();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = new Container().onActivation(
          serviceIdentifierFixture,
          activationMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call activationService.add()', () => {
        const bindingActivationRelation: BindingActivationRelation = {
          serviceId: serviceIdentifierFixture,
        };

        expect(activationServiceMock.add).toHaveBeenCalledTimes(1);
        expect(activationServiceMock.add).toHaveBeenCalledWith(
          activationMock,
          bindingActivationRelation,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.onDeactivation', () => {
    let serviceIdentifierFixture: ServiceIdentifier;
    let deactivationMock: jest.Mock<BindingDeactivation>;

    beforeAll(() => {
      serviceIdentifierFixture = 'service-id';
      deactivationMock = jest.fn();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = new Container().onDeactivation(
          serviceIdentifierFixture,
          deactivationMock,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call deactivationService.add()', () => {
        const bindingDeactivationRelation: BindingDeactivationRelation = {
          serviceId: serviceIdentifierFixture,
        };

        expect(deactivationServiceMock.add).toHaveBeenCalledTimes(1);
        expect(deactivationServiceMock.add).toHaveBeenCalledWith(
          deactivationMock,
          bindingDeactivationRelation,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.unbind', () => {
    let serviceIdentifierFixture: ServiceIdentifier;

    beforeAll(() => {
      serviceIdentifierFixture = 'serviceId';
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        result = await new Container().unbind(serviceIdentifierFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call resolveServiceDeactivations', () => {
        const expectedParams: DeactivationParams = {
          getBindings: expect.any(Function) as unknown as <TInstance>(
            serviceIdentifier: ServiceIdentifier<TInstance>,
          ) => Binding<TInstance>[] | undefined,
          getBindingsFromModule: expect.any(Function) as unknown as <TInstance>(
            moduleId: number,
          ) => Binding<TInstance>[] | undefined,
          getClassMetadata: expect.any(Function) as unknown as (
            type: Newable,
          ) => ClassMetadata,
          getDeactivations: expect.any(Function) as unknown as <TActivated>(
            serviceIdentifier: ServiceIdentifier<TActivated>,
          ) => Iterable<BindingDeactivation<TActivated>> | undefined,
        };

        expect(resolveServiceDeactivations).toHaveBeenCalledTimes(1);
        expect(resolveServiceDeactivations).toHaveBeenCalledWith(
          expectedParams,
          serviceIdentifierFixture,
        );
      });

      it('should call activationService.removeAllByServiceId()', () => {
        expect(
          activationServiceMock.removeAllByServiceId,
        ).toHaveBeenCalledTimes(1);
        expect(activationServiceMock.removeAllByServiceId).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call bindingService.removeAllByServiceId()', () => {
        expect(bindingServiceMock.removeAllByServiceId).toHaveBeenCalledTimes(
          1,
        );
        expect(bindingServiceMock.removeAllByServiceId).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call deactivationService.removeAllByServiceId()', () => {
        expect(
          deactivationServiceMock.removeAllByServiceId,
        ).toHaveBeenCalledTimes(1);
        expect(
          deactivationServiceMock.removeAllByServiceId,
        ).toHaveBeenCalledWith(serviceIdentifierFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.unload', () => {
    let containerModuleFixture: ContainerModule;

    beforeAll(() => {
      containerModuleFixture = {
        id: 2,
      } as Partial<ContainerModule> as ContainerModule;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        result = await new Container().unload(containerModuleFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call resolveModuleDeactivations', () => {
        const expectedParams: DeactivationParams = {
          getBindings: expect.any(Function) as unknown as <TInstance>(
            serviceIdentifier: ServiceIdentifier<TInstance>,
          ) => Binding<TInstance>[] | undefined,
          getBindingsFromModule: expect.any(Function) as unknown as <TInstance>(
            moduleId: number,
          ) => Binding<TInstance>[] | undefined,
          getClassMetadata: expect.any(Function) as unknown as (
            type: Newable,
          ) => ClassMetadata,
          getDeactivations: expect.any(Function) as unknown as <TActivated>(
            serviceIdentifier: ServiceIdentifier<TActivated>,
          ) => Iterable<BindingDeactivation<TActivated>> | undefined,
        };

        expect(resolveModuleDeactivations).toHaveBeenCalledTimes(1);
        expect(resolveModuleDeactivations).toHaveBeenCalledWith(
          expectedParams,
          containerModuleFixture.id,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
