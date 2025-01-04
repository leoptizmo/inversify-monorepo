import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/models/OneToManyMapStar');

import { ServiceIdentifier } from '@inversifyjs/common';

import { OneToManyMapStar } from '../../common/models/OneToManyMapStar';
import { BindingActivation } from '../models/BindingActivation';
import {
  ActivationsService,
  BindingActivationRelation,
} from './ActivationsService';

describe(ActivationsService.name, () => {
  let activationMapsMock: jest.Mocked<
    OneToManyMapStar<BindingActivation, BindingActivationRelation>
  >;

  let parentActivationService: ActivationsService;
  let activationsService: ActivationsService;

  beforeAll(() => {
    activationMapsMock = new OneToManyMapStar<
      BindingActivation,
      BindingActivationRelation
    >({
      moduleId: {
        isOptional: true,
      },
      serviceId: {
        isOptional: false,
      },
    }) as jest.Mocked<
      OneToManyMapStar<BindingActivation, BindingActivationRelation>
    >;

    parentActivationService = new ActivationsService(undefined);

    activationsService = new ActivationsService(parentActivationService);
  });

  describe('.add', () => {
    let activationFixture: BindingActivation;
    let relationFixture: BindingActivationRelation;

    beforeAll(() => {
      activationFixture = () => undefined;
      relationFixture = {
        moduleId: 3,
        serviceId: 'service-id',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = activationsService.add(activationFixture, relationFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call activationMaps.set()', () => {
        expect(activationMapsMock.set).toHaveBeenCalledTimes(1);
        expect(activationMapsMock.set).toHaveBeenCalledWith(
          activationFixture,
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

    describe('when called, and activationMaps.get() returns undefined and parent activationMaps.get() returns Iterable', () => {
      let bindingActivationFixture: BindingActivation;

      let result: unknown;

      beforeAll(() => {
        bindingActivationFixture = Symbol() as unknown as BindingActivation;

        activationMapsMock.get
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce([bindingActivationFixture]);

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

      it('should return BindingActivation[]', () => {
        expect(result).toStrictEqual([bindingActivationFixture]);
      });
    });

    describe('when called, and activationMaps.get() returns Iterable', () => {
      let bindingActivationFixture: BindingActivation;

      let result: unknown;

      beforeAll(() => {
        bindingActivationFixture = Symbol() as unknown as BindingActivation;

        activationMapsMock.get.mockReturnValueOnce([bindingActivationFixture]);

        result = activationsService.get(serviceIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call activationMaps.get()', () => {
        expect(activationMapsMock.get).toHaveBeenCalledTimes(1);
        expect(activationMapsMock.get).toHaveBeenCalledWith(
          'serviceId',
          serviceIdFixture,
        );
      });

      it('should return BindingActivation[]', () => {
        expect(result).toStrictEqual([bindingActivationFixture]);
      });
    });
  });

  describe('.removeAllByModuleId', () => {
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
