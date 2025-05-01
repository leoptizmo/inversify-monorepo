import {
  bindingTypeValues,
  LeafBindingNode,
  PlanServiceNodeParent,
  ResolvedValueBindingNode,
} from '@inversifyjs/core';

export function isResolvedValueBindingNode(
  node: PlanServiceNodeParent | LeafBindingNode,
): node is ResolvedValueBindingNode {
  return node.binding.type === bindingTypeValues.ResolvedValue;
}
