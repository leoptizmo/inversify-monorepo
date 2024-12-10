import { beforeAll, describe, expect, it } from '@jest/globals';

import { Binding } from '../models/Binding';
import { bindingScopeValues } from '../models/BindingScope';
import { bindingTypeValues } from '../models/BindingType';
import { BindingService } from './BindingService';

describe(BindingService.name, () => {
  describe('.get', () => {
    let bindingFixture: Binding<unknown>;

    beforeAll(() => {
      bindingFixture = {
        cache: {
          isRight: false,
          value: undefined,
        },
        id: 2,
        isSatisfiedBy: (): boolean => true,
        moduleId: 1,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: 'service-identifier-fixture',
        type: bindingTypeValues.ConstantValue,
        value: Symbol(),
      };
    });

    describe('when called, with existing bindings', () => {
      let bindingServiceImplementation: BindingService;

      let result: unknown;

      beforeAll(() => {
        bindingServiceImplementation = new BindingService();

        bindingServiceImplementation.set(bindingFixture);

        result = bindingServiceImplementation.get(
          bindingFixture.serviceIdentifier,
        );
      });

      it('should return Binding[]', () => {
        expect(result).toStrictEqual([bindingFixture]);
      });
    });

    describe('when called, with non existing bindings', () => {
      let bindingServiceImplementation: BindingService;

      let result: unknown;

      beforeAll(() => {
        bindingServiceImplementation = new BindingService();

        result = bindingServiceImplementation.get(
          bindingFixture.serviceIdentifier,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.remove', () => {
    let bindingFixture: Binding<unknown>;

    beforeAll(() => {
      bindingFixture = {
        cache: {
          isRight: false,
          value: undefined,
        },
        id: 2,
        isSatisfiedBy: (): boolean => true,
        moduleId: 1,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: Symbol(),
        type: bindingTypeValues.ConstantValue,
        value: Symbol(),
      };
    });

    describe('when called, with existing bindings', () => {
      let bindingServiceImplementation: BindingService;

      beforeAll(() => {
        bindingServiceImplementation = new BindingService();

        bindingServiceImplementation.set(bindingFixture);
        bindingServiceImplementation.remove(bindingFixture.serviceIdentifier);
      });

      describe('when called .get()', () => {
        let result: unknown;

        beforeAll(() => {
          result = bindingServiceImplementation.get(
            bindingFixture.serviceIdentifier,
          );
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });

  describe('.removeByModule', () => {
    let bindingFixture: Binding<unknown>;

    beforeAll(() => {
      bindingFixture = {
        cache: {
          isRight: false,
          value: undefined,
        },
        id: 2,
        isSatisfiedBy: (): boolean => true,
        moduleId: 1,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: Symbol(),
        type: bindingTypeValues.ConstantValue,
        value: Symbol(),
      };
    });

    describe('when called, with existing bindings', () => {
      let bindingServiceImplementation: BindingService;

      beforeAll(() => {
        bindingServiceImplementation = new BindingService();

        bindingServiceImplementation.set(bindingFixture);
        bindingServiceImplementation.removeByModule(
          bindingFixture.moduleId as number,
        );
      });

      describe('when called .get()', () => {
        let result: unknown;

        beforeAll(() => {
          result = bindingServiceImplementation.get(
            bindingFixture.serviceIdentifier,
          );
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
