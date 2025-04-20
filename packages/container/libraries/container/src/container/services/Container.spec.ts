import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mock,
  Mocked,
  vitest,
} from 'vitest';

vitest.mock('@inversifyjs/core');

vitest.mock('../../common/calculations/getFirstIterableResult');

import { Newable, ServiceIdentifier } from '@inversifyjs/common';
import {
  ActivationsService,
  Binding,
  BindingActivation,
  BindingActivationRelation,
  BindingDeactivation,
  BindingDeactivationRelation,
  BindingScope,
  bindingScopeValues,
  BindingService,
  DeactivationsService,
  getClassMetadata,
  GetOptions,
  GetOptionsTagConstraint,
  GetPlanOptions,
  plan,
  PlanParams,
  PlanResult,
  PlanResultCacheService,
  ResolutionContext,
  ResolutionParams,
  resolve,
} from '@inversifyjs/core';
import { PluginContext } from '@inversifyjs/plugin';

vitest.mock('./BindingManager');
vitest.mock('./ContainerModuleManager');
vitest.mock('./SnapshotManager');

import { BindToFluentSyntax } from '../../binding/models/BindingFluentSyntax';
import { InversifyContainerError } from '../../error/models/InversifyContainerError';
import { InversifyContainerErrorKind } from '../../error/models/InversifyContainerErrorKind';
import { ContainerModule } from '../models/ContainerModule';
import { BindingManager } from './BindingManager';
import { Container } from './Container';
import { ContainerModuleManager } from './ContainerModuleManager';
import { SnapshotManager } from './SnapshotManager';

describe(Container, () => {
  let activationServiceMock: Mocked<ActivationsService>;
  let bindingManagerMock: Mocked<BindingManager>;
  let bindingServiceMock: Mocked<BindingService>;
  let containerModuleManagerMock: Mocked<ContainerModuleManager>;
  let deactivationServiceMock: Mocked<DeactivationsService>;
  let snapshotManagerMock: Mocked<SnapshotManager>;

  let getPlanResultMock: Mock<
    (options: GetPlanOptions) => PlanResult | undefined
  >;
  let setPlanResultMock: Mock<
    (options: GetPlanOptions, planResult: PlanResult) => void
  >;

  beforeAll(() => {
    activationServiceMock = {
      add: vitest.fn(),
      clone: vitest.fn().mockReturnThis(),
      get: vitest.fn(),
      removeAllByModuleId: vitest.fn(),
      removeAllByServiceId: vitest.fn(),
    } as Partial<Mocked<ActivationsService>> as Mocked<ActivationsService>;
    bindingManagerMock = {
      bind: vitest.fn(),
      isBound: vitest.fn(),
      isCurrentBound: vitest.fn(),
      rebind: vitest.fn(),
      rebindSync: vitest.fn(),
      unbind: vitest.fn(),
      unbindAll: vitest.fn(),
      unbindSync: vitest.fn(),
    } as Partial<Mocked<BindingManager>> as Mocked<BindingManager>;
    bindingServiceMock = {
      clone: vitest.fn().mockReturnThis(),
      get: vitest.fn(),
      removeAllByModuleId: vitest.fn(),
    } as Partial<Mocked<BindingService>> as Mocked<BindingService>;
    containerModuleManagerMock = {
      load: vitest.fn(),
      loadSync: vitest.fn(),
      unload: vitest.fn(),
      unloadSync: vitest.fn(),
    } as Partial<
      Mocked<ContainerModuleManager>
    > as Mocked<ContainerModuleManager>;
    deactivationServiceMock = {
      add: vitest.fn(),
      clone: vitest.fn().mockReturnThis(),
      removeAllByModuleId: vitest.fn(),
      removeAllByServiceId: vitest.fn(),
    } as Partial<Mocked<DeactivationsService>> as Mocked<DeactivationsService>;
    snapshotManagerMock = {
      restore: vitest.fn(),
      snapshot: vitest.fn(),
    } as Partial<Mocked<SnapshotManager>> as Mocked<SnapshotManager>;

    getPlanResultMock = vitest.fn();
    setPlanResultMock = vitest.fn();

    vitest.mocked(BindingManager).mockImplementation((): BindingManager => {
      return bindingManagerMock;
    });

    vitest
      .mocked(ContainerModuleManager)
      .mockImplementation((): ContainerModuleManager => {
        return containerModuleManagerMock;
      });

    vitest.mocked(SnapshotManager).mockImplementation((): SnapshotManager => {
      return snapshotManagerMock;
    });

    vitest
      .mocked(ActivationsService.build)
      .mockReturnValue(activationServiceMock);

    vitest.mocked(BindingService.build).mockReturnValue(bindingServiceMock);

    vitest
      .mocked(DeactivationsService.build)
      .mockReturnValue(deactivationServiceMock);

    vitest.mocked(PlanResultCacheService).mockImplementation(function (
      this: PlanResultCacheService,
    ): PlanResultCacheService {
      this.get = getPlanResultMock;
      this.set = setPlanResultMock;

      return this;
    });
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
          vitest.clearAllMocks();
        });

        it('should call new ActivationsService.build()', () => {
          expect(ActivationsService.build).toHaveBeenCalledTimes(2);
          expect(ActivationsService.build).toHaveBeenNthCalledWith(
            1,
            undefined,
          );
          expect(ActivationsService.build).toHaveBeenNthCalledWith(
            2,
            activationServiceMock,
          );
        });

        it('should call BindingService.build', () => {
          expect(BindingService.build).toHaveBeenCalledTimes(2);
          expect(BindingService.build).toHaveBeenNthCalledWith(1, undefined);
          expect(BindingService.build).toHaveBeenNthCalledWith(
            2,
            bindingServiceMock,
          );
        });

        it('should call DeactivationsService.build()', () => {
          expect(DeactivationsService.build).toHaveBeenCalledTimes(2);
          expect(DeactivationsService.build).toHaveBeenNthCalledWith(
            1,
            undefined,
          );
          expect(DeactivationsService.build).toHaveBeenNthCalledWith(
            2,
            deactivationServiceMock,
          );
        });
      });
    });
  });

  describe('.bind', () => {
    describe('when called', () => {
      let bindToFluentSyntaxFixture: BindToFluentSyntax<unknown>;
      let serviceIdentifierFixture: ServiceIdentifier;

      let result: unknown;

      beforeAll(() => {
        bindToFluentSyntaxFixture =
          Symbol() as unknown as BindToFluentSyntax<unknown>;
        serviceIdentifierFixture = 'service-id';

        bindingManagerMock.bind.mockReturnValueOnce(bindToFluentSyntaxFixture);

        result = new Container().bind(serviceIdentifierFixture);
      });

      it('should call bindingManager.bind()', () => {
        expect(bindingManagerMock.bind).toHaveBeenCalledTimes(1);
        expect(bindingManagerMock.bind).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should return BindToFluentSyntax', () => {
        expect(result).toBe(bindToFluentSyntaxFixture);
      });
    });
  });

  describe('.get', () => {
    describe('having a container with options with no autobind', () => {
      let container: Container;

      beforeAll(() => {
        container = new Container();
      });

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

          vitest.mocked(plan).mockReturnValueOnce(planResultFixture);

          vitest.mocked(resolve).mockReturnValueOnce(resolvedValueFixture);

          result = container.get(serviceIdentifierFixture, getOptionsFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call planResultCacheService.get()', () => {
          const expectedGetPlanOptions: GetPlanOptions = {
            isMultiple: false,
            name: getOptionsFixture.name,
            optional: getOptionsFixture.optional,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag,
          };

          expect(getPlanResultMock).toHaveBeenCalledTimes(1);
          expect(getPlanResultMock).toHaveBeenCalledWith(
            expectedGetPlanOptions,
          );
        });

        it('should call plan()', () => {
          const expectedPlanParams: PlanParams = {
            autobindOptions: undefined,
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
            servicesBranch: [],
            setBinding: expect.any(Function) as unknown as <TInstance>(
              binding: Binding<TInstance>,
            ) => void,
          };

          expect(plan).toHaveBeenCalledTimes(1);
          expect(plan).toHaveBeenCalledWith(expectedPlanParams);
        });

        it('should call planResultCacheService.set()', () => {
          const expectedGetPlanOptions: GetPlanOptions = {
            isMultiple: false,
            name: getOptionsFixture.name,
            optional: getOptionsFixture.optional,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag,
          };

          expect(setPlanResultMock).toHaveBeenCalledTimes(1);
          expect(setPlanResultMock).toHaveBeenCalledWith(
            expectedGetPlanOptions,
            planResultFixture,
          );
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

      describe('when called, and planResultCacheService.get() returns a plan', () => {
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

          getPlanResultMock.mockReturnValueOnce(planResultFixture);

          vitest.mocked(resolve).mockReturnValueOnce(resolvedValueFixture);

          result = container.get(serviceIdentifierFixture, getOptionsFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call planResultCacheService.get()', () => {
          const expectedGetPlanOptions: GetPlanOptions = {
            isMultiple: false,
            name: getOptionsFixture.name,
            optional: getOptionsFixture.optional,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag,
          };

          expect(getPlanResultMock).toHaveBeenCalledTimes(1);
          expect(getPlanResultMock).toHaveBeenCalledWith(
            expectedGetPlanOptions,
          );
        });

        it('should not call plan', () => {
          expect(plan).not.toHaveBeenCalled();
        });

        it('should not call planResultCacheService.set', () => {
          expect(setPlanResultMock).not.toHaveBeenCalled();
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

          vitest.mocked(plan).mockReturnValueOnce(planResultFixture);

          vitest.mocked(resolve).mockResolvedValueOnce(resolvedValueFixture);

          try {
            container.get(serviceIdentifierFixture, getOptionsFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call planResultCacheService.get()', () => {
          const expectedGetPlanOptions: GetPlanOptions = {
            isMultiple: false,
            name: getOptionsFixture.name,
            optional: getOptionsFixture.optional,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag,
          };

          expect(getPlanResultMock).toHaveBeenCalledTimes(1);
          expect(getPlanResultMock).toHaveBeenCalledWith(
            expectedGetPlanOptions,
          );
        });

        it('should call plan()', () => {
          const expectedPlanParams: PlanParams = {
            autobindOptions: undefined,
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
            servicesBranch: [],
            setBinding: expect.any(Function) as unknown as <TInstance>(
              binding: Binding<TInstance>,
            ) => void,
          };

          expect(plan).toHaveBeenCalledTimes(1);
          expect(plan).toHaveBeenCalledWith(expectedPlanParams);
        });

        it('should call planResultCacheService.set()', () => {
          const expectedGetPlanOptions: GetPlanOptions = {
            isMultiple: false,
            name: getOptionsFixture.name,
            optional: getOptionsFixture.optional,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag,
          };

          expect(setPlanResultMock).toHaveBeenCalledTimes(1);
          expect(setPlanResultMock).toHaveBeenCalledWith(
            expectedGetPlanOptions,
            planResultFixture,
          );
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

    describe('having a container with options with autobind true and default scope', () => {
      let defaultScopeFixture: BindingScope;
      let container: Container;

      beforeAll(() => {
        defaultScopeFixture = bindingScopeValues.Singleton;
        container = new Container({
          autobind: true,
          defaultScope: defaultScopeFixture,
        });
      });

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

          vitest.mocked(plan).mockReturnValueOnce(planResultFixture);

          vitest.mocked(resolve).mockReturnValueOnce(resolvedValueFixture);

          result = container.get(serviceIdentifierFixture, getOptionsFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call planResultCacheService.get()', () => {
          const expectedGetPlanOptions: GetPlanOptions = {
            isMultiple: false,
            name: getOptionsFixture.name,
            optional: getOptionsFixture.optional,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag,
          };

          expect(getPlanResultMock).toHaveBeenCalledTimes(1);
          expect(getPlanResultMock).toHaveBeenCalledWith(
            expectedGetPlanOptions,
          );
        });

        it('should call plan()', () => {
          const expectedPlanParams: PlanParams = {
            autobindOptions: {
              scope: defaultScopeFixture,
            },
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
            servicesBranch: [],
            setBinding: expect.any(Function) as unknown as <TInstance>(
              binding: Binding<TInstance>,
            ) => void,
          };

          expect(plan).toHaveBeenCalledTimes(1);
          expect(plan).toHaveBeenCalledWith(expectedPlanParams);
        });

        it('should call planResultCacheService.set()', () => {
          const expectedGetPlanOptions: GetPlanOptions = {
            isMultiple: false,
            name: getOptionsFixture.name,
            optional: getOptionsFixture.optional,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag,
          };

          expect(setPlanResultMock).toHaveBeenCalledTimes(1);
          expect(setPlanResultMock).toHaveBeenCalledWith(
            expectedGetPlanOptions,
            planResultFixture,
          );
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

    describe('having a container with options with no autobind and default scope and GetOptions with scope', () => {
      let defaultScopeFixture: BindingScope;
      let container: Container;

      beforeAll(() => {
        defaultScopeFixture = bindingScopeValues.Singleton;
        container = new Container({
          defaultScope: defaultScopeFixture,
        });
      });

      describe('when called', () => {
        let serviceIdentifierFixture: ServiceIdentifier;
        let getOptionsFixture: GetOptions;

        let planResultFixture: PlanResult;

        let resolvedValueFixture: unknown;

        let result: unknown;

        beforeAll(() => {
          serviceIdentifierFixture = 'service-id';
          getOptionsFixture = {
            autobind: true,
            name: 'name',
            optional: true,
            tag: {
              key: 'tag-key',
              value: Symbol(),
            },
          };

          planResultFixture = Symbol() as unknown as PlanResult;

          resolvedValueFixture = Symbol();

          vitest.mocked(plan).mockReturnValueOnce(planResultFixture);

          vitest.mocked(resolve).mockReturnValueOnce(resolvedValueFixture);

          result = container.get(serviceIdentifierFixture, getOptionsFixture);
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call planResultCacheService.get()', () => {
          const expectedGetPlanOptions: GetPlanOptions = {
            isMultiple: false,
            name: getOptionsFixture.name,
            optional: getOptionsFixture.optional,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag,
          };

          expect(getPlanResultMock).toHaveBeenCalledTimes(1);
          expect(getPlanResultMock).toHaveBeenCalledWith(
            expectedGetPlanOptions,
          );
        });

        it('should call plan()', () => {
          const expectedPlanParams: PlanParams = {
            autobindOptions: {
              scope: defaultScopeFixture,
            },
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
            servicesBranch: [],
            setBinding: expect.any(Function) as unknown as <TInstance>(
              binding: Binding<TInstance>,
            ) => void,
          };

          expect(plan).toHaveBeenCalledTimes(1);
          expect(plan).toHaveBeenCalledWith(expectedPlanParams);
        });

        it('should call planResultCacheService.set()', () => {
          const expectedGetPlanOptions: GetPlanOptions = {
            isMultiple: false,
            name: getOptionsFixture.name,
            optional: getOptionsFixture.optional,
            serviceIdentifier: serviceIdentifierFixture,
            tag: getOptionsFixture.tag,
          };

          expect(setPlanResultMock).toHaveBeenCalledTimes(1);
          expect(setPlanResultMock).toHaveBeenCalledWith(
            expectedGetPlanOptions,
            planResultFixture,
          );
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

        vitest.mocked(plan).mockReturnValueOnce(planResultFixture);

        vitest.mocked(resolve).mockReturnValueOnce([resolvedValueFixture]);

        result = new Container().getAll(
          serviceIdentifierFixture,
          getOptionsFixture,
        );
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call planResultCacheService.get()', () => {
        const expectedGetPlanOptions: GetPlanOptions = {
          isMultiple: true,
          name: getOptionsFixture.name,
          optional: getOptionsFixture.optional,
          serviceIdentifier: serviceIdentifierFixture,
          tag: getOptionsFixture.tag,
        };

        expect(getPlanResultMock).toHaveBeenCalledTimes(1);
        expect(getPlanResultMock).toHaveBeenCalledWith(expectedGetPlanOptions);
      });

      it('should call plan()', () => {
        const expectedPlanParams: PlanParams = {
          autobindOptions: undefined,
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
          servicesBranch: [],
          setBinding: expect.any(Function) as unknown as <TInstance>(
            binding: Binding<TInstance>,
          ) => void,
        };

        expect(plan).toHaveBeenCalledTimes(1);
        expect(plan).toHaveBeenCalledWith(expectedPlanParams);
      });

      it('should call planResultCacheService.set()', () => {
        const expectedGetPlanOptions: GetPlanOptions = {
          isMultiple: true,
          name: getOptionsFixture.name,
          optional: getOptionsFixture.optional,
          serviceIdentifier: serviceIdentifierFixture,
          tag: getOptionsFixture.tag,
        };

        expect(setPlanResultMock).toHaveBeenCalledTimes(1);
        expect(setPlanResultMock).toHaveBeenCalledWith(
          expectedGetPlanOptions,
          planResultFixture,
        );
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

        vitest.mocked(plan).mockReturnValueOnce(planResultFixture);

        vitest.mocked(resolve).mockResolvedValueOnce([resolvedValueFixture]);

        try {
          new Container().getAll(serviceIdentifierFixture, getOptionsFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call planResultCacheService.get()', () => {
        const expectedGetPlanOptions: GetPlanOptions = {
          isMultiple: true,
          name: getOptionsFixture.name,
          optional: getOptionsFixture.optional,
          serviceIdentifier: serviceIdentifierFixture,
          tag: getOptionsFixture.tag,
        };

        expect(getPlanResultMock).toHaveBeenCalledTimes(1);
        expect(getPlanResultMock).toHaveBeenCalledWith(expectedGetPlanOptions);
      });

      it('should call plan()', () => {
        const expectedPlanParams: PlanParams = {
          autobindOptions: undefined,
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
          servicesBranch: [],
          setBinding: expect.any(Function) as unknown as <TInstance>(
            binding: Binding<TInstance>,
          ) => void,
        };

        expect(plan).toHaveBeenCalledTimes(1);
        expect(plan).toHaveBeenCalledWith(expectedPlanParams);
      });

      it('should call planResultCacheService.set()', () => {
        const expectedGetPlanOptions: GetPlanOptions = {
          isMultiple: true,
          name: getOptionsFixture.name,
          optional: getOptionsFixture.optional,
          serviceIdentifier: serviceIdentifierFixture,
          tag: getOptionsFixture.tag,
        };

        expect(setPlanResultMock).toHaveBeenCalledTimes(1);
        expect(setPlanResultMock).toHaveBeenCalledWith(
          expectedGetPlanOptions,
          planResultFixture,
        );
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

        vitest.mocked(plan).mockReturnValueOnce(planResultFixture);

        vitest.mocked(resolve).mockReturnValueOnce([resolvedValueFixture]);

        result = await new Container().getAllAsync(
          serviceIdentifierFixture,
          getOptionsFixture,
        );
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call planResultCacheService.get()', () => {
        const expectedGetPlanOptions: GetPlanOptions = {
          isMultiple: true,
          name: getOptionsFixture.name,
          optional: getOptionsFixture.optional,
          serviceIdentifier: serviceIdentifierFixture,
          tag: getOptionsFixture.tag,
        };

        expect(getPlanResultMock).toHaveBeenCalledTimes(1);
        expect(getPlanResultMock).toHaveBeenCalledWith(expectedGetPlanOptions);
      });

      it('should call plan()', () => {
        const expectedPlanParams: PlanParams = {
          autobindOptions: undefined,
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
          servicesBranch: [],
          setBinding: expect.any(Function) as unknown as <TInstance>(
            binding: Binding<TInstance>,
          ) => void,
        };

        expect(plan).toHaveBeenCalledTimes(1);
        expect(plan).toHaveBeenCalledWith(expectedPlanParams);
      });

      it('should call planResultCacheService.set()', () => {
        const expectedGetPlanOptions: GetPlanOptions = {
          isMultiple: true,
          name: getOptionsFixture.name,
          optional: getOptionsFixture.optional,
          serviceIdentifier: serviceIdentifierFixture,
          tag: getOptionsFixture.tag,
        };

        expect(setPlanResultMock).toHaveBeenCalledTimes(1);
        expect(setPlanResultMock).toHaveBeenCalledWith(
          expectedGetPlanOptions,
          planResultFixture,
        );
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

        vitest.mocked(plan).mockReturnValueOnce(planResultFixture);

        vitest.mocked(resolve).mockReturnValueOnce(resolvedValueFixture);

        result = await new Container().getAsync(
          serviceIdentifierFixture,
          getOptionsFixture,
        );
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call planResultCacheService.get()', () => {
        const expectedGetPlanOptions: GetPlanOptions = {
          isMultiple: false,
          name: getOptionsFixture.name,
          optional: getOptionsFixture.optional,
          serviceIdentifier: serviceIdentifierFixture,
          tag: getOptionsFixture.tag,
        };

        expect(getPlanResultMock).toHaveBeenCalledTimes(1);
        expect(getPlanResultMock).toHaveBeenCalledWith(expectedGetPlanOptions);
      });

      it('should call plan()', () => {
        const expectedPlanParams: PlanParams = {
          autobindOptions: undefined,
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
          servicesBranch: [],
          setBinding: expect.any(Function) as unknown as <TInstance>(
            binding: Binding<TInstance>,
          ) => void,
        };

        expect(plan).toHaveBeenCalledTimes(1);
        expect(plan).toHaveBeenCalledWith(expectedPlanParams);
      });

      it('should call planResultCacheService.set()', () => {
        const expectedGetPlanOptions: GetPlanOptions = {
          isMultiple: false,
          name: getOptionsFixture.name,
          optional: getOptionsFixture.optional,
          serviceIdentifier: serviceIdentifierFixture,
          tag: getOptionsFixture.tag,
        };

        expect(setPlanResultMock).toHaveBeenCalledTimes(1);
        expect(setPlanResultMock).toHaveBeenCalledWith(
          expectedGetPlanOptions,
          planResultFixture,
        );
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

    describe('when called', () => {
      let isBoundResult: boolean;
      let result: unknown;

      beforeAll(() => {
        isBoundResult = false;

        bindingManagerMock.isBound.mockReturnValueOnce(isBoundResult);

        result = new Container().isBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingService.isBound()', () => {
        expect(bindingManagerMock.isBound).toHaveBeenCalledTimes(1);
        expect(bindingManagerMock.isBound).toHaveBeenCalledWith(
          serviceIdentifierFixture,
          {
            name: nameFixture,
            tag: tagFixture,
          },
        );
      });

      it('should return expected result', () => {
        expect(result).toBe(isBoundResult);
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

    describe('when called', () => {
      let isBoundResult: boolean;
      let result: unknown;

      beforeAll(() => {
        isBoundResult = false;

        bindingManagerMock.isCurrentBound.mockReturnValueOnce(isBoundResult);

        result = new Container().isCurrentBound(serviceIdentifierFixture, {
          name: nameFixture,
          tag: tagFixture,
        });
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingService.isCurrentBound()', () => {
        expect(bindingManagerMock.isCurrentBound).toHaveBeenCalledTimes(1);
        expect(bindingManagerMock.isCurrentBound).toHaveBeenCalledWith(
          serviceIdentifierFixture,
          {
            name: nameFixture,
            tag: tagFixture,
          },
        );
      });

      it('should return expected result', () => {
        expect(result).toBe(isBoundResult);
      });
    });
  });

  describe('.load', () => {
    let containerModuleMock: Mocked<ContainerModule>;

    beforeAll(() => {
      containerModuleMock = {
        load: vitest.fn().mockReturnValue(undefined),
      } as Partial<Mocked<ContainerModule>> as Mocked<ContainerModule>;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        result = await new Container().load(containerModuleMock);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call containerModuleManager.load', () => {
        expect(containerModuleManagerMock.load).toHaveBeenCalledTimes(1);
        expect(containerModuleManagerMock.load).toHaveBeenCalledWith(
          containerModuleMock,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.loadSync', () => {
    let containerModuleMock: Mocked<ContainerModule>;

    beforeAll(() => {
      containerModuleMock = {
        load: vitest.fn().mockReturnValue(undefined),
      } as Partial<Mocked<ContainerModule>> as Mocked<ContainerModule>;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = new Container().loadSync(containerModuleMock);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call containerModuleManager.loadSync', () => {
        expect(containerModuleManagerMock.loadSync).toHaveBeenCalledTimes(1);
        expect(containerModuleManagerMock.loadSync).toHaveBeenCalledWith(
          containerModuleMock,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.onActivation', () => {
    let serviceIdentifierFixture: ServiceIdentifier;
    let activationMock: Mock<BindingActivation>;

    beforeAll(() => {
      serviceIdentifierFixture = 'service-id';
      activationMock = vitest.fn();
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
        vitest.clearAllMocks();
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
    let deactivationMock: Mock<BindingDeactivation>;

    beforeAll(() => {
      serviceIdentifierFixture = 'service-id';
      deactivationMock = vitest.fn();
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
        vitest.clearAllMocks();
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

  describe('.rebind', () => {
    describe('when called', () => {
      let bindToFluentSyntaxFixture: BindToFluentSyntax<unknown>;
      let serviceIdentifierFixture: ServiceIdentifier;

      let result: unknown;

      beforeAll(async () => {
        bindToFluentSyntaxFixture =
          Symbol() as unknown as BindToFluentSyntax<unknown>;
        serviceIdentifierFixture = 'service-id';

        vitest
          .mocked(bindingManagerMock.rebind)
          .mockResolvedValueOnce(bindToFluentSyntaxFixture);

        result = await new Container().rebind(serviceIdentifierFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingManager.rebind()', () => {
        expect(bindingManagerMock.rebind).toHaveBeenCalledTimes(1);
        expect(bindingManagerMock.rebind).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should return BindToFluentSyntax', () => {
        expect(result).toBe(bindToFluentSyntaxFixture);
      });
    });
  });

  describe('.rebindSync', () => {
    describe('when called', () => {
      let bindToFluentSyntaxFixture: BindToFluentSyntax<unknown>;
      let serviceIdentifierFixture: ServiceIdentifier;

      let result: unknown;

      beforeAll(() => {
        bindToFluentSyntaxFixture =
          Symbol() as unknown as BindToFluentSyntax<unknown>;
        serviceIdentifierFixture = 'service-id';

        vitest
          .mocked(bindingManagerMock.rebindSync)
          .mockReturnValueOnce(bindToFluentSyntaxFixture);

        result = new Container().rebindSync(serviceIdentifierFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingManager.rebindSync()', () => {
        expect(bindingManagerMock.rebindSync).toHaveBeenCalledTimes(1);
        expect(bindingManagerMock.rebindSync).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should return BindToFluentSyntax', () => {
        expect(result).toStrictEqual(bindToFluentSyntaxFixture);
      });
    });
  });

  describe('.register', () => {
    describe('having a non plugin newable type', () => {
      let pluginType: Newable;

      beforeAll(() => {
        pluginType = vitest.fn();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            new Container().register(pluginType);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          vitest.clearAllMocks();
        });

        it('should call pluginType', () => {
          const expected: Mocked<PluginContext> = {
            activationService: expect.any(Object),
            bindingService: expect.any(Object),
            deactivationService: expect.any(Object),
            planResultCacheService: expect.any(Object),
          } as Partial<Mocked<PluginContext>> as Mocked<PluginContext>;

          expect(pluginType).toHaveBeenCalledTimes(1);
          expect(pluginType).toHaveBeenCalledWith(expected);
        });

        it('should throw an InversifyContainerError', () => {
          const expectedErrorProperties: Partial<InversifyContainerError> = {
            kind: InversifyContainerErrorKind.invalidOperation,
            message: 'Invalid plugin. The plugin must extend the Plugin class',
          };

          expect(result).toBeInstanceOf(InversifyContainerError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });
  });

  describe('.restore', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        new Container().restore();
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call snapshotManager.restore()', () => {
        expect(snapshotManagerMock.restore).toHaveBeenCalledTimes(1);
        expect(snapshotManagerMock.restore).toHaveBeenCalledWith();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.snapshot', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        new Container().snapshot();
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call snapshotManager.snapshot()', () => {
        expect(snapshotManagerMock.snapshot).toHaveBeenCalledTimes(1);
        expect(snapshotManagerMock.snapshot).toHaveBeenCalledWith();
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
        bindingManagerMock.unbind.mockResolvedValueOnce(undefined);

        result = await new Container().unbind(serviceIdentifierFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingManager.unbind()', () => {
        expect(bindingManagerMock.unbind).toHaveBeenCalledTimes(1);
        expect(bindingManagerMock.unbind).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('unbindSync', () => {
    let serviceIdentifierFixture: ServiceIdentifier;

    beforeAll(() => {
      serviceIdentifierFixture = 'serviceId';
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        bindingManagerMock.unbindSync.mockReturnValueOnce(undefined);

        result = new Container().unbindSync(serviceIdentifierFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingManager.unbindSync()', () => {
        expect(bindingManagerMock.unbindSync).toHaveBeenCalledTimes(1);
        expect(bindingManagerMock.unbindSync).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.unbindAll', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        bindingManagerMock.unbindAll.mockResolvedValueOnce(undefined);

        result = await new Container().unbindAll();
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call bindingManager.unbindAll()', () => {
        expect(bindingManagerMock.unbindAll).toHaveBeenCalledTimes(1);
        expect(bindingManagerMock.unbindAll).toHaveBeenCalledWith();
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
        vitest.clearAllMocks();
      });

      it('should call containerModuleManager.unload()', () => {
        expect(containerModuleManagerMock.unload).toHaveBeenCalledTimes(1);
        expect(containerModuleManagerMock.unload).toHaveBeenCalledWith(
          containerModuleFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.unloadSync', () => {
    let containerModuleFixture: ContainerModule;

    beforeAll(() => {
      containerModuleFixture = {
        id: 2,
      } as Partial<ContainerModule> as ContainerModule;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = new Container().unloadSync(containerModuleFixture);
      });

      afterAll(() => {
        vitest.clearAllMocks();
      });

      it('should call containerModuleManager.unloadSync()', () => {
        expect(containerModuleManagerMock.unloadSync).toHaveBeenCalledTimes(1);
        expect(containerModuleManagerMock.unloadSync).toHaveBeenCalledWith(
          containerModuleFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
