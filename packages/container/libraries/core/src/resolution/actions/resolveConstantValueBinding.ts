import { bindingTypeValues } from '../../binding/models/BindingType';
import { ConstantValueBinding } from '../../binding/models/ConstantValueBinding';
import { resolveConstantValueBindingCallback } from '../calculations/resolveConstantValueBindingCallback';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';
import { resolveSingletonScopedBinding } from './resolveSingletonScopedBinding';

export const resolveConstantValueBinding: <TActivated>(
  params: ResolutionParams,
  binding: ConstantValueBinding<TActivated>,
) => Resolved<TActivated> = resolveSingletonScopedBinding<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  typeof bindingTypeValues.ConstantValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ConstantValueBinding<any>
>(resolveConstantValueBindingCallback);
