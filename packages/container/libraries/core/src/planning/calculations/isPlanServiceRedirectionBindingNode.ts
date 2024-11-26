import { BindingNodeParent } from '../models/BindingNodeParent';
import { PlanBindingNode } from '../models/PlanBindingNode';
import { PlanServiceRedirectionBindingNode } from '../models/PlanServiceRedirectionBindingNode';

export function isPlanServiceRedirectionBindingNode(
  node: PlanBindingNode | BindingNodeParent,
): node is PlanServiceRedirectionBindingNode {
  return (
    (node as Partial<PlanServiceRedirectionBindingNode>).redirections !==
    undefined
  );
}
