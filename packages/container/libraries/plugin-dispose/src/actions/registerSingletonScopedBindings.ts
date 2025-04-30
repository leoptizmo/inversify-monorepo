import {
  bindingScopeValues,
  GetPlanOptions,
  PlanBindingNode,
  PlanResult,
  PlanServiceNode,
} from '@inversifyjs/core';

import { isInstanceBindingNode } from '../calculations/isInstanceBindingNode';
import { isPlanServiceRedirectionBindingNode } from '../calculations/isPlanServiceRedirectionBindingNode';
import { isResolvedValueBindingNode } from '../calculations/isResolvedValueBindingNode';
import { BindingDisposeMetadata } from '../models/BindingDisposeMetadata';
import { SingletonScopedBinding } from '../models/SingletonScopedBinding';
import { getPluginDisposeBinding } from './getPluginDisposeBinding';
import { setPluginDisposeBinding } from './setPluginDisposeBinding';

export function registerSingletonScopedBindings(
  _options: GetPlanOptions,
  result: PlanResult,
): void {
  registerServiceSingletonScopedBindings(result.tree.root, []);
}

function registerServiceSingletonScopedBindings(
  serviceNode: PlanServiceNode,
  singletonDependencies: SingletonScopedBinding[],
): void {
  if (serviceNode.bindings === undefined) {
    return;
  }

  if (Array.isArray(serviceNode.bindings)) {
    for (const binding of serviceNode.bindings) {
      registerSingletonBinding(binding, singletonDependencies);
    }
  } else {
    registerSingletonBinding(serviceNode.bindings, singletonDependencies);
  }
}

function registerSingletonBinding(
  bindingNode: PlanBindingNode,
  singletonDependencies: SingletonScopedBinding[],
): void {
  if (isPlanServiceRedirectionBindingNode(bindingNode)) {
    for (const redirection of bindingNode.redirections) {
      registerSingletonBinding(redirection, singletonDependencies);
    }

    return;
  }

  if (bindingNode.binding.scope === bindingScopeValues.Singleton) {
    const existingMetadata: BindingDisposeMetadata | undefined =
      getPluginDisposeBinding(bindingNode.binding as SingletonScopedBinding);

    if (existingMetadata !== undefined) {
      return;
    }

    setPluginDisposeBinding(bindingNode.binding as SingletonScopedBinding, {
      dependendentBindings: new Set<SingletonScopedBinding>(
        singletonDependencies,
      ),
    });

    singletonDependencies.push(bindingNode.binding as SingletonScopedBinding);
  }

  if (isInstanceBindingNode(bindingNode)) {
    for (const param of bindingNode.constructorParams) {
      if (param !== undefined) {
        registerServiceSingletonScopedBindings(param, [
          ...singletonDependencies,
        ]);
      }
    }

    for (const param of bindingNode.propertyParams.values()) {
      registerServiceSingletonScopedBindings(param, [...singletonDependencies]);
    }

    return;
  }

  if (isResolvedValueBindingNode(bindingNode)) {
    for (const param of bindingNode.params) {
      registerServiceSingletonScopedBindings(param, [...singletonDependencies]);
    }
  }
}
