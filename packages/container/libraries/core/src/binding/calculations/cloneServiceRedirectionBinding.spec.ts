import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

import { bindingTypeValues } from '../models/BindingType';
import { ServiceRedirectionBinding } from '../models/ServiceRedirectionBinding';
import { cloneServiceRedirectionBinding } from './cloneServiceRedirectionBinding';

describe(cloneServiceRedirectionBinding, () => {
  let serviceRedirectionBindingFixture: ServiceRedirectionBinding<unknown>;

  beforeAll(() => {
    serviceRedirectionBindingFixture = {
      id: 0,
      isSatisfiedBy: () => true,
      moduleId: 1,
      serviceIdentifier: Symbol(),
      targetServiceIdentifier: Symbol(),
      type: bindingTypeValues.ServiceRedirection,
    };
  });

  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = cloneServiceRedirectionBinding(serviceRedirectionBindingFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should return a ServiceRedirectionBinding', () => {
      const expected: ServiceRedirectionBinding<unknown> = {
        id: serviceRedirectionBindingFixture.id,
        isSatisfiedBy: serviceRedirectionBindingFixture.isSatisfiedBy,
        moduleId: serviceRedirectionBindingFixture.moduleId,
        serviceIdentifier: serviceRedirectionBindingFixture.serviceIdentifier,
        targetServiceIdentifier:
          serviceRedirectionBindingFixture.targetServiceIdentifier,
        type: serviceRedirectionBindingFixture.type,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
