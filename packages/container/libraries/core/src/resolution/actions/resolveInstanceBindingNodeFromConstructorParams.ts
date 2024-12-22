import { isPromise } from '@inversifyjs/common';

import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { InstanceBindingNode } from '../../planning/models/InstanceBindingNode';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved, SyncResolved } from '../models/Resolved';
import { resolvePostConstruct } from './resolvePostConstruct';

export function resolveInstanceBindingNodeFromConstructorParams<
  TActivated,
  TBinding extends InstanceBinding<TActivated> = InstanceBinding<TActivated>,
>(
  setInstanceProperties: (
    params: ResolutionParams,
    instance: Record<string | symbol, unknown>,
    node: InstanceBindingNode,
  ) => void | Promise<void>,
): (
  constructorValues: unknown[],
  params: ResolutionParams,
  node: InstanceBindingNode<TBinding>,
) => Resolved<TActivated> {
  return (
    constructorValues: unknown[],
    params: ResolutionParams,
    node: InstanceBindingNode<TBinding>,
  ): Resolved<TActivated> => {
    const instance: SyncResolved<TActivated> &
      Record<string | symbol, unknown> = new node.binding.implementationType(
      ...constructorValues,
    ) as SyncResolved<TActivated> & Record<string | symbol, unknown>;

    const propertiesAssignmentResult: void | Promise<void> =
      setInstanceProperties(params, instance, node);

    if (isPromise(propertiesAssignmentResult)) {
      return propertiesAssignmentResult.then(
        (): Resolved<TActivated> =>
          resolvePostConstruct(
            instance,
            node.binding,
            node.classMetadata.lifecycle.postConstructMethodName,
          ),
      );
    }

    return resolvePostConstruct(
      instance,
      node.binding,
      node.classMetadata.lifecycle.postConstructMethodName,
    );
  };
}
