import { bindingScopeValues } from '../models/BindingScope';
import { bindingTypeValues } from '../models/BindingType';
import { ConstantValueBinding } from '../models/ConstantValueBinding';

export class ConstantValueBindingFixtures {
  public static get any(): ConstantValueBinding<unknown> {
    return {
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
      value: Symbol.for('constant-value-binding-fixture-value'),
    };
  }

  public static get withCacheWithIsRightFalse(): ConstantValueBinding<unknown> {
    return {
      ...ConstantValueBindingFixtures.any,
      cache: {
        isRight: false,
        value: undefined,
      },
    };
  }

  public static get withCacheWithIsRightTrue(): ConstantValueBinding<unknown> {
    return {
      ...ConstantValueBindingFixtures.any,
      cache: {
        isRight: true,
        value: Symbol.for('constant-value-binding-fixture-value'),
      },
    };
  }

  public static get withOnActivationUndefined(): ConstantValueBinding<unknown> {
    return {
      ...ConstantValueBindingFixtures.any,
      onActivation: undefined,
    };
  }

  public static get withOnDeactivationAsync(): ConstantValueBinding<unknown> {
    return {
      ...ConstantValueBindingFixtures.any,
      onDeactivation: async (): Promise<void> => undefined,
    };
  }

  public static get withOnDeactivationSync(): ConstantValueBinding<unknown> {
    return {
      ...ConstantValueBindingFixtures.any,
      onDeactivation: (): void => undefined,
    };
  }

  public static get withOnDeactivationUndefined(): ConstantValueBinding<unknown> {
    return {
      ...ConstantValueBindingFixtures.any,
      onDeactivation: undefined,
    };
  }

  public static get withModuleIdUndefined(): ConstantValueBinding<unknown> {
    return {
      ...ConstantValueBindingFixtures.any,
      moduleId: undefined,
    };
  }

  public static get withModuleId(): ConstantValueBinding<unknown> {
    return {
      ...ConstantValueBindingFixtures.any,
      moduleId: 1,
    };
  }
}
