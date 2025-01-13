import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/models/OneToManyMapStar');

import { ServiceIdentifier } from '@inversifyjs/common';

jest.mock('../../common/calculations/chain');

import { chain } from '../../common/calculations/chain';
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

    parentActivationService = ActivationsService.build(undefined);

    activationsService = ActivationsService.build(parentActivationService);
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

      it('should call activationMaps.add()', () => {
        expect(activationMapsMock.add).toHaveBeenCalledTimes(1);
        expect(activationMapsMock.add).toHaveBeenCalledWith(
          activationFixture,
          relationFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.clone', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        activationMapsMock.clone.mockReturnValueOnce(activationMapsMock);

        result = activationsService.clone();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call activationMaps.clone', () => {
        expect(activationMapsMock.clone).toHaveBeenCalledTimes(1);
        expect(activationMapsMock.clone).toHaveBeenCalledWith();
      });

      it('should return a clone()', () => {
        expect(result).toStrictEqual(activationsService);
      });
    });
  });

  describe('.get', () => {
    let serviceIdFixture: ServiceIdentifier;

    beforeAll(() => {
      serviceIdFixture = 'service-identifier';
    });

    describe('when called, and activationMaps.get() returns Iterable and parent activationMaps.get() returns undefined', () => {
      let bindingActivationFixture: BindingActivation;

      let result: unknown;

      beforeAll(() => {
        bindingActivationFixture = Symbol() as unknown as BindingActivation;

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

      it('should return BindingActivation[]', () => {
        expect(result).toStrictEqual([bindingActivationFixture]);
      });
    });

    describe('when called, and activationMaps.get() returns Iterable and parent activationMaps.get() returns Iterable', () => {
      let bindingActivationFixture: BindingActivation;

      let result: unknown;

      beforeAll(() => {
        bindingActivationFixture = Symbol() as unknown as BindingActivation;

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

      it('should return BindingActivation[]', () => {
        expect(result).toStrictEqual([
          bindingActivationFixture,
          bindingActivationFixture,
        ]);
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
