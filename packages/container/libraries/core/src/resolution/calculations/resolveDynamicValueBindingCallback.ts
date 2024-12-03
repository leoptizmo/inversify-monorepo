import { DynamicValueBinding } from '../../binding/models/DynamicValueBinding';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';

export function resolveDynamicValueBindingCallback<TActivated>(
  params: ResolutionParams,
  binding: DynamicValueBinding<TActivated>,
): Resolved<TActivated> {
  return binding.value(params.context);
}
