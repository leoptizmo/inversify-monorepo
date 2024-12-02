import { DynamicValueBinding } from '../../binding/models/DynamicValueBinding';
import { ResolutionParams } from '../models/ResolutionParams';

export function resolveDynamicValueBindingCallback<TActivated>(
  params: ResolutionParams,
  binding: DynamicValueBinding<TActivated>,
): TActivated | Promise<TActivated> {
  return binding.value(params.context);
}
