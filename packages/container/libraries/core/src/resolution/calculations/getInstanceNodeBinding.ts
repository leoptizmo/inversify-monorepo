import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { InstanceBindingNode } from '../../planning/models/InstanceBindingNode';

export function getInstanceNodeBinding<TActivated>(
  node: InstanceBindingNode<InstanceBinding<TActivated>>,
): InstanceBinding<TActivated> {
  return node.binding;
}
