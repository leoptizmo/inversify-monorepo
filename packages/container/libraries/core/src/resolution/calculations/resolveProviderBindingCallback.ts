import { Provider } from '../../binding/models/Provider';
import { ProviderBinding } from '../../binding/models/ProviderBinding';
import { ResolutionParams } from '../models/ResolutionParams';

export function resolveProviderBindingCallback<TActivated>(
  params: ResolutionParams,
  binding: ProviderBinding<TActivated>,
): Provider<TActivated> {
  return binding.provider(params.context);
}
