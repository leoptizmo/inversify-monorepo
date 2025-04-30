import {
  bindingTypeValues,
  InstanceBindingNode,
  LeafBindingNode,
  PlanServiceNodeParent,
} from '@inversifyjs/core';

export function isInstanceBindingNode(
  node: PlanServiceNodeParent | LeafBindingNode,
): node is InstanceBindingNode {
  return node.binding.type === bindingTypeValues.Instance;
}
