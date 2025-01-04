import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/calculations/chain');
jest.mock('../../common/models/OneToManyMapStar');

import { ServiceIdentifier } from '@inversifyjs/common';

import { chain } from '../../common/calculations/chain';
import { OneToManyMapStar } from '../../common/models/OneToManyMapStar';
import { BindingDeactivation } from '../models/BindingDeactivation';
import {
  BindingDeactivationRelation,
  DeactivationsService,
} from './DeactivationsService';

describe(DeactivationsService.name, () => {
  let activationMapsMock: jest.Mocked<
    OneToManyMapStar<BindingDeactivation, BindingDeactivationRelation>
  >;

  let parentActivationService: DeactivationsService;
  let activationsService: DeactivationsService;

  beforeAll(() => {
    activationMapsMock = new OneToManyMapStar<
      BindingDeactivation,
      BindingDeactivationRelation
    >({
      moduleId: {
        isOptional: true,
      },
      serviceId: {
        isOptional: false,
      },
    }) as jest.Mocked<
      OneToManyMapStar<BindingDeactivation, BindingDeactivationRelation>
    >;

    parentActivationService = new DeactivationsService(undefined);

    activationsService = new DeactivationsService(parentActivationService);
  });

  describe('.add', () => {
    let deactivationFixture: BindingDeactivation;
    let relationFixture: BindingDeactivationRelation;

    beforeAll(() => {
      deactivationFixture = () => undefined;
      relationFixture = {
        moduleId: 3,
        serviceId: 'service-id',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = activationsService.add(deactivationFixture, relationFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call activationMaps.set()', () => {
        expect(activationMapsMock.set).toHaveBeenCalledTimes(1);
        expect(activationMapsMock.set).toHaveBeenCalledWith(
          deactivationFixture,
          relationFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.get', () => {
    let serviceIdFixture: ServiceIdentifier;

    beforeAll(() => {
      serviceIdFixture = 'service-identifier';
    });

    describe('when called, and activationMaps.get() returns Iterable and parent activationMaps.get() returns undefined', () => {
      let bindingActivationFixture: BindingDeactivation;

      let result: unknown;

      beforeAll(() => {
        bindingActivationFixture = Symbol() as unknown as BindingDeactivation;

        activationMapsMock.get
          .mockReturnValueOnce([bindingActivationFixture])
          .mockReturnValueOnce(undefined);

        (chain as jest.Mock<typeof chain>).mockReturnValueOnce([
          bindingActivationFixture,
        ]);

        result = activationsService.get(serviceIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call activationMaps.get()', () => {
        expect(activationMapsMock.get).toHaveBeenCalledTimes(2);
        expect(activationMapsMock.get).toHaveBeenNthCalledWith(
          1,
          'serviceId',
          serviceIdFixture,
        );
        expect(activationMapsMock.get).toHaveBeenNthCalledWith(
          2,
          'serviceId',
          serviceIdFixture,
        );
      });

      it('should call chain()', () => {
        expect(chain).toHaveBeenCalledTimes(1);
        expect(chain).toHaveBeenCalledWith([bindingActivationFixture]);
      });

      it('should return BindingDeactivation[]', () => {
        expect(result).toStrictEqual([bindingActivationFixture]);
      });
    });

    describe('when called, and activationMaps.get() returns Iterable and parent activationMaps.get() returns Iterable', () => {
      let bindingActivationFixture: BindingDeactivation;

      let result: unknown;

      beforeAll(() => {
        bindingActivationFixture = Symbol() as unknown as BindingDeactivation;

        activationMapsMock.get
          .mockReturnValueOnce([bindingActivationFixture])
          .mockReturnValueOnce([bindingActivationFixture]);

        (chain as jest.Mock<typeof chain>)
          .mockReturnValueOnce([bindingActivationFixture])
          .mockReturnValueOnce([
            bindingActivationFixture,
            bindingActivationFixture,
          ]);

        result = activationsService.get(serviceIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call activationMaps.get()', () => {
        expect(activationMapsMock.get).toHaveBeenCalledTimes(2);
        expect(activationMapsMock.get).toHaveBeenNthCalledWith(
          1,
          'serviceId',
          serviceIdFixture,
        );
        expect(activationMapsMock.get).toHaveBeenNthCalledWith(
          2,
          'serviceId',
          serviceIdFixture,
        );
      });

      it('should call chain()', () => {
        expect(chain).toHaveBeenCalledTimes(2);
        expect(chain).toHaveBeenNthCalledWith(1, [bindingActivationFixture]);
        expect(chain).toHaveBeenNthCalledWith(
          2,
          [bindingActivationFixture],
          [bindingActivationFixture],
        );
      });

      it('should return BindingDeactivation[]', () => {
        expect(result).toStrictEqual([
          bindingActivationFixture,
          bindingActivationFixture,
        ]);
      });
    });
  });

  describe('.removeAllByModule', () => {
    let moduleIdFixture: number;

    beforeAll(() => {
      moduleIdFixture = 3;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = activationsService.removeAllByModuleId(moduleIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call activationMaps.removeByRelation()', () => {
        expect(activationMapsMock.removeByRelation).toHaveBeenCalledTimes(1);
        expect(activationMapsMock.removeByRelation).toHaveBeenCalledWith(
          'moduleId',
          moduleIdFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.removeAllByServiceId', () => {
    let serviceIdFixture: ServiceIdentifier;

    beforeAll(() => {
      serviceIdFixture = 'service-id';
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = activationsService.removeAllByServiceId(serviceIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call activationMaps.removeByRelation()', () => {
        expect(activationMapsMock.removeByRelation).toHaveBeenCalledTimes(1);
        expect(activationMapsMock.removeByRelation).toHaveBeenCalledWith(
          'serviceId',
          serviceIdFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
