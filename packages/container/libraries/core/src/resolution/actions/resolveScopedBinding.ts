import { BindingScope } from '../../binding/models/BindingScope';
import { BindingType } from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { getSelf } from '../../common/calculations/getSelf';
import { ResolutionParams } from '../models/ResolutionParams';
import { resolveScoped } from './resolveScoped';

export const resolveScopedBinding: <
  TActivated,
  TType extends BindingType,
  TBinding extends ScopedBinding<TType, BindingScope, TActivated>,
>(
  resolve: (params: ResolutionParams, binding: TBinding) => TActivated,
) => (params: ResolutionParams, binding: TBinding) => TActivated = <
  TActivated,
  TType extends BindingType,
  TBinding extends ScopedBinding<TType, BindingScope, TActivated>,
>(
  resolve: (params: ResolutionParams, binding: TBinding) => TActivated,
) => resolveScoped(getSelf, resolve);
