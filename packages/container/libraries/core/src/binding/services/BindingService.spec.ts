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

    describe('having a BindingService with existing bindings with no parent', () => {
      describe('when called', () => {
        let bindingServiceImplementation: BindingService;

        let result: unknown;

        beforeAll(() => {
          bindingServiceImplementation = new BindingService(undefined);

          bindingServiceImplementation.set(bindingFixture);

          result = bindingServiceImplementation.get(
            bindingFixture.serviceIdentifier,
          );
        });

        it('should return Binding[]', () => {
          expect(result).toStrictEqual([bindingFixture]);
        });
      });
    });

    describe('having a BindingService with non existing bindings with no parent', () => {
      describe('when called', () => {
        let bindingServiceImplementation: BindingService;

        let result: unknown;

        beforeAll(() => {
          bindingServiceImplementation = new BindingService(undefined);

          result = bindingServiceImplementation.get(
            bindingFixture.serviceIdentifier,
          );
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('having a BindingService with parent with existing bindings', () => {
      describe('when called', () => {
        let bindingServiceImplementation: BindingService;
        let parentBindingServiceImplementation: BindingService;

        let result: unknown;

        beforeAll(() => {
          parentBindingServiceImplementation = new BindingService(undefined);
          parentBindingServiceImplementation.set(bindingFixture);

          bindingServiceImplementation = new BindingService(
            parentBindingServiceImplementation,
          );

          result = bindingServiceImplementation.get(
            bindingFixture.serviceIdentifier,
          );
        });

        it('should return Binding[]', () => {
          expect(result).toStrictEqual([bindingFixture]);
        });
      });
    });

    describe('having a BindingService with parent with non existing bindings', () => {
      describe('when called, with non existing bindings', () => {
        let bindingServiceImplementation: BindingService;
        let parentBindingServiceImplementation: BindingService;

        let result: unknown;

        beforeAll(() => {
          parentBindingServiceImplementation = new BindingService(undefined);

          bindingServiceImplementation = new BindingService(
            parentBindingServiceImplementation,
          );

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
        bindingServiceImplementation = new BindingService(undefined);

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
        bindingServiceImplementation = new BindingService(undefined);

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
