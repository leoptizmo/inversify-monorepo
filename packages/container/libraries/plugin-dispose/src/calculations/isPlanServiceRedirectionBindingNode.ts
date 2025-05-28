import {
  PlanBindingNode,
  PlanServiceRedirectionBindingNode,
} from '@gritcode/inversifyjs-core';

export function isPlanServiceRedirectionBindingNode(
  node: PlanBindingNode,
): node is PlanServiceRedirectionBindingNode {
  return (
    (node as Partial<PlanServiceRedirectionBindingNode>).redirections !==
    undefined
  );
}
