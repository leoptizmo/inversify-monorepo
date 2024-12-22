import { isPromise } from '@inversifyjs/common';

import { bindingTypeValues } from '../../binding/models/BindingType';
import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { isPlanServiceRedirectionBindingNode } from '../../planning/calculations/isPlanServiceRedirectionBindingNode';
import { InstanceBindingNode } from '../../planning/models/InstanceBindingNode';
import { LeafBindingNode } from '../../planning/models/LeafBindingNode';
import { PlanBindingNode } from '../../planning/models/PlanBindingNode';
import { PlanServiceNode } from '../../planning/models/PlanServiceNode';
import { PlanServiceNodeParent } from '../../planning/models/PlanServiceNodeParent';
import { PlanServiceRedirectionBindingNode } from '../../planning/models/PlanServiceRedirectionBindingNode';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';
import { resolveConstantValueBinding } from './resolveConstantValueBinding';
import { resolveDynamicValueBinding } from './resolveDynamicValueBinding';
import { resolveFactoryBinding } from './resolveFactoryBinding';
import { resolveInstanceBindingConstructorParams as curryResolveInstanceBindingConstructorParams } from './resolveInstanceBindingConstructorParams';
import { resolveInstanceBindingNode as curryResolveInstanceBindingNode } from './resolveInstanceBindingNode';
import { resolveInstanceBindingNodeAsyncFromConstructorParams } from './resolveInstanceBindingNodeAsyncFromConstructorParams';
import { resolveInstanceBindingNodeFromConstructorParams } from './resolveInstanceBindingNodeFromConstructorParams';
import { resolveProviderBinding } from './resolveProviderBinding';
import { resolveScopedInstanceBindingNode as curryResolveScopedInstanceBindingNode } from './resolveScopedInstanceBindingNode';
import { resolveServiceRedirectionBindingNode as curryResolveServiceRedirectionBindingNode } from './resolveServiceRedirectionBindingNode';
import { setInstanceProperties as currySetInstanceProperties } from './setInstanceProperties';

const setInstanceProperties: (
  params: ResolutionParams,
  instance: Record<string | symbol, unknown>,
  node: InstanceBindingNode,
) => void | Promise<void> = currySetInstanceProperties(resolveServiceNode);

const resolveServiceRedirectionBindingNode: (
  params: ResolutionParams,
  node: PlanServiceRedirectionBindingNode,
) => unknown[] = curryResolveServiceRedirectionBindingNode(resolveBindingNode);

const resolveInstanceBindingNode: <
  TActivated,
  TBinding extends InstanceBinding<TActivated> = InstanceBinding<TActivated>,
>(
  params: ResolutionParams,
  node: InstanceBindingNode<TBinding>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Resolved<TActivated> = curryResolveInstanceBindingNode<any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  curryResolveInstanceBindingConstructorParams<any>(resolveServiceNode),
  resolveInstanceBindingNodeAsyncFromConstructorParams(
    resolveInstanceBindingNodeFromConstructorParams(setInstanceProperties),
  ),
  resolveInstanceBindingNodeFromConstructorParams(setInstanceProperties),
);

const resolveScopedInstanceBindingNode: <TActivated>(
  params: ResolutionParams,
  node: InstanceBindingNode<InstanceBinding<TActivated>>,
) => Resolved<TActivated> = curryResolveScopedInstanceBindingNode(
  resolveInstanceBindingNode,
);

export function resolve(params: ResolutionParams): unknown {
  const serviceNode: PlanServiceNode = params.planResult.tree.root;

  return resolveServiceNode(params, serviceNode);
}

function resolveBindingNode<TActivated>(
  params: ResolutionParams,
  planBindingNode: PlanServiceNodeParent | LeafBindingNode<TActivated>,
): Resolved<TActivated> {
  switch (planBindingNode.binding.type) {
    case bindingTypeValues.ConstantValue:
      return resolveConstantValueBinding(params, planBindingNode.binding);
    case bindingTypeValues.DynamicValue:
      return resolveDynamicValueBinding(params, planBindingNode.binding);
    case bindingTypeValues.Factory:
      return resolveFactoryBinding(params, planBindingNode.binding);
    case bindingTypeValues.Instance:
      return resolveScopedInstanceBindingNode<TActivated>(
        params,
        planBindingNode as InstanceBindingNode<InstanceBinding<TActivated>>,
      );
    case bindingTypeValues.Provider:
      return resolveProviderBinding(params, planBindingNode.binding);
  }
}

function resolveServiceNode(
  params: ResolutionParams,
  serviceNode: PlanServiceNode,
): unknown {
  if (serviceNode.bindings === undefined) {
    return undefined;
  }

  if (Array.isArray(serviceNode.bindings)) {
    return resolveMultipleBindingServiceNode(params, serviceNode.bindings);
  }

  return resolveSingleBindingServiceNode(params, serviceNode.bindings);
}

function resolveMultipleBindingServiceNode(
  params: ResolutionParams,
  bindings: PlanBindingNode[],
): unknown[] | Promise<unknown[]> {
  const resolvedValues: unknown[] = [];

  for (const binding of bindings) {
    if (isPlanServiceRedirectionBindingNode(binding)) {
      resolvedValues.push(
        ...resolveServiceRedirectionBindingNode(params, binding),
      );
    } else {
      resolvedValues.push(resolveBindingNode(params, binding));
    }
  }

  if (resolvedValues.some(isPromise)) {
    return Promise.all(resolvedValues);
  }

  return resolvedValues;
}

function resolveSingleBindingServiceNode(
  params: ResolutionParams,
  binding: PlanBindingNode,
): unknown {
  if (isPlanServiceRedirectionBindingNode(binding)) {
    const resolvedValues: unknown[] = resolveServiceRedirectionBindingNode(
      params,
      binding,
    );

    if (resolvedValues.length === 1) {
      return resolvedValues[0];
    } else {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.resolution,
        'Unexpected multiple resolved values on single injection',
      );
    }
  } else {
    return resolveBindingNode(params, binding);
  }
}
