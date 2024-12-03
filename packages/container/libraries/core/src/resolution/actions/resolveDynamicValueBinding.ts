import { bindingTypeValues } from '../../binding/models/BindingType';
import { DynamicValueBinding } from '../../binding/models/DynamicValueBinding';
import { resolveDynamicValueBindingCallback } from '../calculations/resolveDynamicValueBindingCallback';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';
import { resolveScopedBinding } from './resolveScopedBinding';

export const resolveDynamicValueBinding: <TActivated>(
  params: ResolutionParams,
  binding: DynamicValueBinding<TActivated>,
) => Resolved<TActivated> = resolveScopedBinding<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  typeof bindingTypeValues.DynamicValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DynamicValueBinding<any>
>(resolveDynamicValueBindingCallback);
