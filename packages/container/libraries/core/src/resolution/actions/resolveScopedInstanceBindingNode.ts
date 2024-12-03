import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { InstanceBindingNode } from '../../planning/models/InstanceBindingNode';
import { getInstanceNodeBinding } from '../calculations/getInstanceNodeBinding';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';
import { resolveScoped } from './resolveScoped';

export const resolveScopedInstanceBindingNode: <TActivated>(
  resolve: (
    params: ResolutionParams,
    node: InstanceBindingNode<InstanceBinding<TActivated>>,
  ) => Resolved<TActivated>,
) => (
  params: ResolutionParams,
  node: InstanceBindingNode<InstanceBinding<TActivated>>,
) => Resolved<TActivated> = <TActivated>(
  resolve: (
    params: ResolutionParams,
    node: InstanceBindingNode<InstanceBinding<TActivated>>,
  ) => Resolved<TActivated>,
) => resolveScoped(getInstanceNodeBinding, resolve);
