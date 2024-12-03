import { BindingScope } from '../../binding/models/BindingScope';
import { BindingType } from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { getSelf } from '../../common/calculations/getSelf';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';
import { resolveScoped } from './resolveScoped';

export const resolveScopedBinding: <
  TActivated,
  TType extends BindingType,
  TBinding extends ScopedBinding<TType, BindingScope, TActivated>,
>(
  resolve: (
    params: ResolutionParams,
    binding: TBinding,
  ) => Resolved<TActivated>,
) => (params: ResolutionParams, binding: TBinding) => Resolved<TActivated> = <
  TActivated,
  TType extends BindingType,
  TBinding extends ScopedBinding<TType, BindingScope, TActivated>,
>(
  resolve: (
    params: ResolutionParams,
    binding: TBinding,
  ) => Resolved<TActivated>,
) => resolveScoped(getSelf, resolve);
