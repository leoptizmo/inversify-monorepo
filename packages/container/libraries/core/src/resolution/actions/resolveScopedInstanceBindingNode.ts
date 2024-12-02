import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { InstanceBindingNode } from '../../planning/models/InstanceBindingNode';
import { getInstanceNodeBinding } from '../calculations/getInstanceNodeBinding';
import { ResolutionParams } from '../models/ResolutionParams';
import { resolveScoped } from './resolveScoped';

export const resolveScopedInstanceBindingNode: <TActivated>(
  resolve: (
    params: ResolutionParams,
    node: InstanceBindingNode<InstanceBinding<TActivated>>,
  ) => TActivated,
) => (
  params: ResolutionParams,
  node: InstanceBindingNode<InstanceBinding<TActivated>>,
) => TActivated = <TActivated>(
  resolve: (
    params: ResolutionParams,
    node: InstanceBindingNode<InstanceBinding<TActivated>>,
  ) => TActivated,
) => resolveScoped(getInstanceNodeBinding, resolve);
