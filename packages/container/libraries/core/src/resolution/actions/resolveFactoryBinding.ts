import { bindingTypeValues } from '../../binding/models/BindingType';
import { Factory } from '../../binding/models/Factory';
import { FactoryBinding } from '../../binding/models/FactoryBinding';
import { resolveFactoryBindingCallback } from '../calculations/resolveFactoryBindingCallback';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';
import { resolveSingletonScopedBinding } from './resolveSingletonScopedBinding';

export const resolveFactoryBinding: <TActivated extends Factory<unknown>>(
  params: ResolutionParams,
  binding: FactoryBinding<TActivated>,
) => Resolved<TActivated> = resolveSingletonScopedBinding<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  typeof bindingTypeValues.Factory,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FactoryBinding<any>
>(resolveFactoryBindingCallback);
