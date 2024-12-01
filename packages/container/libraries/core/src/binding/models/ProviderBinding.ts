import { ResolutionContext } from '../../resolution/models/ResolutionContext';
import { bindingScopeValues } from './BindingScope';
import { bindingTypeValues } from './BindingType';
import { Provider } from './Provider';
import { ScopedBinding } from './ScopedBinding';

export interface ProviderBinding<TActivated>
  extends ScopedBinding<
    typeof bindingTypeValues.Provider,
    typeof bindingScopeValues.Singleton,
    Provider<TActivated>
  > {
  readonly provider: (context: ResolutionContext) => Provider<TActivated>;
}
