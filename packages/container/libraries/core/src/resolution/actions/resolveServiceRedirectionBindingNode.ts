import { isPlanServiceRedirectionBindingNode } from '../../planning/calculations/isPlanServiceRedirectionBindingNode';
import { LeafBindingNode } from '../../planning/models/LeafBindingNode';
import { PlanServiceNodeParent } from '../../planning/models/PlanServiceNodeParent';
import { PlanServiceRedirectionBindingNode } from '../../planning/models/PlanServiceRedirectionBindingNode';
import { ResolutionParams } from '../models/ResolutionParams';

export function resolveServiceRedirectionBindingNode(
  resolveBindingNode: (
    params: ResolutionParams,
    planBindingNode: PlanServiceNodeParent | LeafBindingNode,
  ) => unknown,
): (
  params: ResolutionParams,
  node: PlanServiceRedirectionBindingNode,
) => unknown[] {
  function innerResolveServiceRedirectionBindingNode(
    params: ResolutionParams,
    node: PlanServiceRedirectionBindingNode,
  ): unknown[] {
    const resolvedValues: unknown[] = [];

    for (const redirection of node.redirections) {
      if (isPlanServiceRedirectionBindingNode(redirection)) {
        resolvedValues.push(
          ...innerResolveServiceRedirectionBindingNode(params, redirection),
        );
      } else {
        resolvedValues.push(resolveBindingNode(params, redirection));
      }
    }

    return resolvedValues;
  }

  return innerResolveServiceRedirectionBindingNode;
}
