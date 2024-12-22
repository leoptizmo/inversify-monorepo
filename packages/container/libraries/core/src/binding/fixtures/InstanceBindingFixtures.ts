import { bindingScopeValues } from '../models/BindingScope';
import { bindingTypeValues } from '../models/BindingType';
import { InstanceBinding } from '../models/InstanceBinding';

export class InstanceBindingFixtures {
  public static get any(): InstanceBinding<unknown> {
    return {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: 1,
      implementationType: class Foo {},
      isSatisfiedBy: () => true,
      moduleId: undefined,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: 'service-id',
      type: bindingTypeValues.Instance,
    };
  }

  public static get withCacheWithScopeSingleton(): InstanceBinding<unknown> {
    return {
      ...InstanceBindingFixtures.any,
      scope: bindingScopeValues.Singleton,
    };
  }
}
