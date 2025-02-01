import { ResolvedValueBinding } from '../../binding/models/ResolvedValueBinding';
import { ResolvedValueBindingNode } from '../../planning/models/ResolvedValueBindingNode';
import { getResolvedValueNodeBinding } from '../calculations/getResolvedValueNodeBinding';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';
import { resolveScoped } from './resolveScoped';

export const resolveScopedResolvedValueBindingNode: <TActivated>(
  resolve: (
    params: ResolutionParams,
    node: ResolvedValueBindingNode<ResolvedValueBinding<TActivated>>,
  ) => Resolved<TActivated>,
) => (
  params: ResolutionParams,
  node: ResolvedValueBindingNode<ResolvedValueBinding<TActivated>>,
) => Resolved<TActivated> = <TActivated>(
  resolve: (
    params: ResolutionParams,
    node: ResolvedValueBindingNode<ResolvedValueBinding<TActivated>>,
  ) => Resolved<TActivated>,
) => resolveScoped(getResolvedValueNodeBinding, resolve);
