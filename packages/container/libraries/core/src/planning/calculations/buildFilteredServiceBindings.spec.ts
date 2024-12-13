import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Binding } from '../../binding/models/Binding';
import { InternalBindingMetadata } from '../../binding/models/BindingMetadataImplementation';
import { bindingScopeValues } from '../../binding/models/BindingScope';
import { bindingTypeValues } from '../../binding/models/BindingType';
import { SingleInmutableLinkedList } from '../../common/models/SingleInmutableLinkedList';
import { BasePlanParams } from '../models/BasePlanParams';
import {
  buildFilteredServiceBindings,
  BuildFilteredServiceBindingsOptions,
} from './buildFilteredServiceBindings';

describe(buildFilteredServiceBindings.name, () => {
  describe('having no options', () => {
    let paramsMock: jest.Mocked<BasePlanParams>;
    let bindingMetadataListFixture: SingleInmutableLinkedList<InternalBindingMetadata>;

    beforeAll(() => {
      paramsMock = {
        getBindings: jest.fn(),
      } as Partial<jest.Mocked<BasePlanParams>> as jest.Mocked<BasePlanParams>;
      bindingMetadataListFixture = {
        last: {
          elem: {
            name: 'name',
            serviceIdentifier: 'service-id',
            tags: new Map(),
          },
          previous: undefined,
        },
      } as Partial<
        SingleInmutableLinkedList<InternalBindingMetadata>
      > as SingleInmutableLinkedList<InternalBindingMetadata>;
    });

    describe('when called, and params.getBinding() returns undefined', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildFilteredServiceBindings(
          paramsMock,
          bindingMetadataListFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getBinding()', () => {
        expect(paramsMock.getBindings).toHaveBeenCalledTimes(1);
        expect(paramsMock.getBindings).toHaveBeenCalledWith(
          bindingMetadataListFixture.last.elem.serviceIdentifier,
        );
      });

      it('should return empty array', () => {
        expect(result).toStrictEqual([]);
      });
    });

    describe('when called, and params.getBinding() returns Binding[]', () => {
      let bindingFixture: Binding;

      let result: unknown;

      beforeAll(() => {
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
          value: Symbol(),
        };

        paramsMock.getBindings.mockReturnValueOnce([bindingFixture]);

        result = buildFilteredServiceBindings(
          paramsMock,
          bindingMetadataListFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getBinding()', () => {
        expect(paramsMock.getBindings).toHaveBeenCalledTimes(1);
        expect(paramsMock.getBindings).toHaveBeenCalledWith(
          bindingMetadataListFixture.last.elem.serviceIdentifier,
        );
      });

      it('should return empty array', () => {
        expect(result).toStrictEqual([bindingFixture]);
      });
    });
  });

  describe('having options with customServiceIdentifier', () => {
    let paramsMock: jest.Mocked<BasePlanParams>;
    let bindingMetadataListFixture: SingleInmutableLinkedList<InternalBindingMetadata>;
    let optionsFixture: BuildFilteredServiceBindingsOptions;

    beforeAll(() => {
      paramsMock = {
        getBindings: jest.fn(),
      } as Partial<jest.Mocked<BasePlanParams>> as jest.Mocked<BasePlanParams>;
      bindingMetadataListFixture = {
        last: {
          elem: {
            name: 'name',
            serviceIdentifier: 'service-id',
            tags: new Map(),
          },
          previous: undefined,
        },
      } as Partial<
        SingleInmutableLinkedList<InternalBindingMetadata>
      > as SingleInmutableLinkedList<InternalBindingMetadata>;
      optionsFixture = {
        customServiceIdentifier: 'custom-service-id',
      };
    });

    describe('when called, and params.getBinding() returns undefined', () => {
      let result: unknown;

      beforeAll(() => {
        result = buildFilteredServiceBindings(
          paramsMock,
          bindingMetadataListFixture,
          optionsFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getBinding()', () => {
        expect(paramsMock.getBindings).toHaveBeenCalledTimes(1);
        expect(paramsMock.getBindings).toHaveBeenCalledWith(
          optionsFixture.customServiceIdentifier,
        );
      });

      it('should return empty array', () => {
        expect(result).toStrictEqual([]);
      });
    });
  });
});
