import { isPromise } from '@inversifyjs/common';

import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { InstanceBindingNode } from '../../planning/models/InstanceBindingNode';
import { PlanServiceNode } from '../../planning/models/PlanServiceNode';
import { ResolutionParams } from '../models/ResolutionParams';

export function resolveInstanceBindingConstructorParams<
  TActivated,
  TBinding extends InstanceBinding<TActivated> = InstanceBinding<TActivated>,
>(
  resolveServiceNode: (
    params: ResolutionParams,
    serviceNode: PlanServiceNode,
  ) => unknown,
): (
  params: ResolutionParams,
  node: InstanceBindingNode<TBinding>,
) => unknown[] | Promise<unknown[]> {
  return (
    params: ResolutionParams,
    node: InstanceBindingNode<TBinding>,
  ): unknown[] | Promise<unknown[]> => {
    const constructorResolvedValues: unknown[] = [];

    for (const constructorParam of node.constructorParams) {
      if (constructorParam === undefined) {
        constructorResolvedValues.push(undefined);
      } else {
        constructorResolvedValues.push(
          resolveServiceNode(params, constructorParam),
        );
      }
    }

    return constructorResolvedValues.some(isPromise)
      ? Promise.all(constructorResolvedValues)
      : constructorResolvedValues;
  };
}
