import { ServiceIdentifier } from '@inversifyjs/common';
import { Container } from '@inversifyjs/container';
import {
  Binding,
  bindingScopeValues,
  bindingTypeValues,
  DeactivationParams,
  resolveBindingsDeactivations,
} from '@inversifyjs/core';
import { Plugin, PluginApi, PluginContext } from '@inversifyjs/plugin';

import { getPluginDisposeBinding } from '../actions/getPluginDisposeBinding';
import { registerSingletonScopedBindings } from '../actions/registerSingletonScopedBindings';
import { buildDeactivationParams } from '../calculations/buildDeactivationParams';
import { BindingDisposeMetadata } from '../models/BindingDisposeMetadata';
import { SingletonScopedBinding } from '../models/SingletonScopedBinding';

export class PluginDispose extends Plugin<Container> {
  public load(api: PluginApi): void {
    api.define(Symbol.asyncDispose, this.#disposeAsync.bind(this));
    api.define(Symbol.dispose, this.#disposeSync.bind(this));
    api.onPlan(registerSingletonScopedBindings);
  }

  #dispose(): void | Promise<void> {
    const bindingWithMetadataPair: [
      SingletonScopedBinding,
      BindingDisposeMetadata,
    ][] = [];

    const singletonScopeBindingsSet: Set<SingletonScopedBinding> =
      this.#buildSingletonScopeBindingsSet();

    for (const binding of singletonScopeBindingsSet) {
      const metadata: BindingDisposeMetadata | undefined =
        getPluginDisposeBinding(binding);

      if (metadata !== undefined) {
        bindingWithMetadataPair.push([binding, metadata]);
      }
    }

    // Sort the bindings by the number of dependencies ascending
    // This way, we can dispose the bindings with less dependencies first
    bindingWithMetadataPair.sort(
      (
        [, firstBindingDisposeMetadata]: [
          SingletonScopedBinding,
          BindingDisposeMetadata,
        ],
        [, secondBindingDisposeMetadata]: [
          SingletonScopedBinding,
          BindingDisposeMetadata,
        ],
      ) =>
        firstBindingDisposeMetadata.dependendentBindings.size -
        secondBindingDisposeMetadata.dependendentBindings.size,
    );

    const deactivationParams: DeactivationParams = buildDeactivationParams(
      this._context,
    );

    let result: void | Promise<void> = undefined;

    for (const [binding] of bindingWithMetadataPair) {
      if (result === undefined) {
        result = resolveBindingsDeactivations(deactivationParams, [binding]);
      } else {
        result = result.then((): void | Promise<void> =>
          resolveBindingsDeactivations(deactivationParams, [binding]),
        );
      }
    }

    return result;
  }

  #buildSingletonScopeBindingsSet(): Set<SingletonScopedBinding> {
    const context: PluginContext = this._context;

    const boundServiceIdentifiers: Iterable<ServiceIdentifier> =
      context.bindingService.getBoundServices();

    const singletonScopeBindingsSet: Set<SingletonScopedBinding> = new Set();

    for (const serviceIdentifier of boundServiceIdentifiers) {
      const binding: Iterable<Binding> | undefined =
        context.bindingService.get(serviceIdentifier);

      if (binding !== undefined) {
        for (const bindingItem of binding) {
          // Service redirections have no scope. Instead, they redirect to another service.
          // These services are traversed in this loop, so we can skip them now.
          if (
            bindingItem.type !== bindingTypeValues.ServiceRedirection &&
            bindingItem.scope === bindingScopeValues.Singleton
          ) {
            singletonScopeBindingsSet.add(
              bindingItem as SingletonScopedBinding,
            );
          }
        }
      }
    }

    return singletonScopeBindingsSet;
  }

  async #disposeAsync(): Promise<void> {
    await this.#dispose();
  }

  #disposeSync(): void {
    const disposeResult: void | Promise<void> = this.#dispose();

    if (disposeResult !== undefined) {
      throw new Error(
        'Unable to dispose services syncronously. They must be disposed synchronously.',
      );
    }
  }
}
