import { Factory } from '../../binding/models/Factory';
import { FactoryBinding } from '../../binding/models/FactoryBinding';
import { ResolutionParams } from '../models/ResolutionParams';

export function resolveFactoryBindingCallback(
  params: ResolutionParams,
  binding: FactoryBinding<unknown>,
): Factory<unknown> {
  return binding.factory(params.context);
}
