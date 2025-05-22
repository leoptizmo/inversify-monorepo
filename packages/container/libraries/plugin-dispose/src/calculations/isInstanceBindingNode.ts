import {
  bindingTypeValues,
  InstanceBindingNode,
  LeafBindingNode,
  PlanServiceNodeParent,
} from '@gritcode/inversifyjs-core';

export function isInstanceBindingNode(
  node: PlanServiceNodeParent | LeafBindingNode,
): node is InstanceBindingNode {
  return node.binding.type === bindingTypeValues.Instance;
}
