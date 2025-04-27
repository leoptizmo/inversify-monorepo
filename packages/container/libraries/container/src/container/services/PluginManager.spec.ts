import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mocked,
  vitest,
} from 'vitest';

import { Newable } from '@inversifyjs/common';
import {
  ActivationsService,
  BindingService,
  DeactivationsService,
  PlanResultCacheService,
} from '@inversifyjs/core';
import {
  isPlugin,
  Plugin,
  PluginApi,
  PluginContext,
} from '@inversifyjs/plugin';

import { InversifyContainerError } from '../../error/models/InversifyContainerError';
import { InversifyContainerErrorKind } from '../../error/models/InversifyContainerErrorKind';
import type { Container } from './Container';
import { PluginManager } from './PluginManager';
import { ServiceReferenceManager } from './ServiceReferenceManager';
import { ServiceResolutionManager } from './ServiceResolutionManager';

describe(PluginManager, () => {
  let containerFixture: Container;
  let serviceReferenceManagerFixture: ServiceReferenceManager;
  let serviceResolutionManagerMock: Mocked<ServiceResolutionManager>;

  beforeAll(() => {
    containerFixture = Symbol() as unknown as Container;
    serviceReferenceManagerFixture = {
      activationService:
        {} as Partial<ActivationsService> as ActivationsService,
      bindingService: {} as Partial<BindingService> as BindingService,
      deactivationService:
        {} as Partial<DeactivationsService> as DeactivationsService,
      planResultCacheService:
        {} as Partial<PlanResultCacheService> as PlanResultCacheService,
    } as Partial<ServiceReferenceManager> as ServiceReferenceManager;
    serviceResolutionManagerMock = {
      onPlan: vitest.fn(),
    } as Partial<
      Mocked<ServiceResolutionManager>
    > as Mocked<ServiceResolutionManager>;
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
            new PluginManager(
              containerFixture,
              serviceReferenceManagerFixture,
              serviceResolutionManagerMock,
            ).register(pluginType);
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

    describe('having a plugin newable type', () => {
      let pluginMock: Mocked<Plugin<Container>>;

      let pluginType: Newable;

      beforeAll(() => {
        pluginMock = {
          [isPlugin]: true,
          load: vitest.fn(),
        } as Partial<Mocked<Plugin<Container>>> as Mocked<Plugin<Container>>;

        pluginType = vitest.fn().mockReturnValueOnce(pluginMock);
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            new PluginManager(
              containerFixture,
              serviceReferenceManagerFixture,
              serviceResolutionManagerMock,
            ).register(pluginType);
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

        it('should call load method of the plugin instance', () => {
          const expected: PluginApi = {
            define: expect.any(Function),
            onPlan: expect.any(Function),
          };

          expect(pluginMock.load).toHaveBeenCalledTimes(1);
          expect(pluginMock.load).toHaveBeenCalledWith(expected);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
