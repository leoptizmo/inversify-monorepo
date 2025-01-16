import { BindingMetadata } from '../../binding/models/BindingMetadata';
import { PlanBindingNode } from '../models/PlanBindingNode';
import { PlanServiceNode } from '../models/PlanServiceNode';
import { checkPlanServiceRedirectionBindingNodeSingleInjectionBindings } from './checkPlanServiceRedirectionBindingNodeSingleInjectionBindings';
import { isPlanServiceRedirectionBindingNode } from './isPlanServiceRedirectionBindingNode';
import { throwErrorWhenUnexpectedBindingsAmountFound } from './throwErrorWhenUnexpectedBindingsAmountFound';

const SINGLE_INJECTION_BINDINGS: number = 1;

export function checkServiceNodeSingleInjectionBindings(
  serviceNode: PlanServiceNode,
  isOptional: boolean,
  bindingMetadata: BindingMetadata,
): void {
  if (Array.isArray(serviceNode.bindings)) {
    if (serviceNode.bindings.length === SINGLE_INJECTION_BINDINGS) {
      const [planBindingNode]: [PlanBindingNode] = serviceNode.bindings as [
        PlanBindingNode,
      ];

      if (isPlanServiceRedirectionBindingNode(planBindingNode)) {
        checkPlanServiceRedirectionBindingNodeSingleInjectionBindings(
          planBindingNode,
          isOptional,
          bindingMetadata,
        );
      }

      return;
    }
  }

  throwErrorWhenUnexpectedBindingsAmountFound(
    serviceNode.bindings,
    isOptional,
    serviceNode,
    bindingMetadata,
  );
}
