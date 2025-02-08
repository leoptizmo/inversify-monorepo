import { BindingConstraints } from '../../binding/models/BindingConstraints';
import { PlanBindingNode } from '../models/PlanBindingNode';
import { PlanServiceRedirectionBindingNode } from '../models/PlanServiceRedirectionBindingNode';
import { isPlanServiceRedirectionBindingNode } from './isPlanServiceRedirectionBindingNode';
import { throwErrorWhenUnexpectedBindingsAmountFound } from './throwErrorWhenUnexpectedBindingsAmountFound';

const SINGLE_INJECTION_BINDINGS: number = 1;

export function checkPlanServiceRedirectionBindingNodeSingleInjectionBindings(
  serviceRedirectionBindingNode: PlanServiceRedirectionBindingNode,
  isOptional: boolean,
  bindingConstraints: BindingConstraints,
): void {
  if (
    serviceRedirectionBindingNode.redirections.length ===
    SINGLE_INJECTION_BINDINGS
  ) {
    const [planBindingNode]: [PlanBindingNode] =
      serviceRedirectionBindingNode.redirections as [PlanBindingNode];

    if (isPlanServiceRedirectionBindingNode(planBindingNode)) {
      checkPlanServiceRedirectionBindingNodeSingleInjectionBindings(
        planBindingNode,
        isOptional,
        bindingConstraints,
      );
    }

    return;
  }

  throwErrorWhenUnexpectedBindingsAmountFound(
    serviceRedirectionBindingNode.redirections,
    isOptional,
    serviceRedirectionBindingNode,
    bindingConstraints,
  );
}
