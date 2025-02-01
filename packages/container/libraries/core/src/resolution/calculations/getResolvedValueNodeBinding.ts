import { ResolvedValueBinding } from '../../binding/models/ResolvedValueBinding';
import { ResolvedValueBindingNode } from '../../planning/models/ResolvedValueBindingNode';

export function getResolvedValueNodeBinding<TActivated>(
  node: ResolvedValueBindingNode<ResolvedValueBinding<TActivated>>,
): ResolvedValueBinding<TActivated> {
  return node.binding;
}
