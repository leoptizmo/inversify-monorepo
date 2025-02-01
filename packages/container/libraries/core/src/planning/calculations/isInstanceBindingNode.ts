import { bindingTypeValues } from '../../binding/models/BindingType';
import { InstanceBindingNode } from '../models/InstanceBindingNode';
import { PlanServiceNodeParent } from '../models/PlanServiceNodeParent';

export function isInstanceBindingNode(
  node: PlanServiceNodeParent,
): node is InstanceBindingNode {
  return node.binding.type === bindingTypeValues.Instance;
}
