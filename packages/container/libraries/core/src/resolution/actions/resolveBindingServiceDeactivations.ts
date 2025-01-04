import { isPromise, ServiceIdentifier } from '@inversifyjs/common';

import { BindingDeactivation } from '../../binding/models/BindingDeactivation';
import { DeactivationParams } from '../models/DeactivationParams';
import { Resolved, SyncResolved } from '../models/Resolved';

export function resolveBindingServiceDeactivations<TActivated>(
  params: DeactivationParams,
  serviceIdentifier: ServiceIdentifier<TActivated>,
  value: Resolved<TActivated>,
): void | Promise<void> {
  const deactivations: Iterable<BindingDeactivation<TActivated>> | undefined =
    params.getDeactivations(serviceIdentifier);

  if (deactivations === undefined) {
    return undefined;
  }

  if (isPromise(value)) {
    return resolveBindingDeactivationsFromIteratorAsync(
      value,
      deactivations[Symbol.iterator](),
    );
  }

  return resolveBindingDeactivationsFromIterator(
    value,
    deactivations[Symbol.iterator](),
  );
}

function resolveBindingDeactivationsFromIterator<TActivated>(
  value: SyncResolved<TActivated>,
  deactivationsIterator: Iterator<BindingDeactivation<TActivated>>,
): void | Promise<void> {
  let deactivationIteratorResult: IteratorResult<
    BindingDeactivation<TActivated>
  > = deactivationsIterator.next();

  while (deactivationIteratorResult.done !== true) {
    const nextDeactivationValue: void | Promise<void> =
      deactivationIteratorResult.value(value);

    if (isPromise(nextDeactivationValue)) {
      return resolveBindingDeactivationsFromIteratorAsync(
        value,
        deactivationsIterator,
      );
    }

    deactivationIteratorResult = deactivationsIterator.next();
  }
}

async function resolveBindingDeactivationsFromIteratorAsync<TActivated>(
  value: Resolved<TActivated>,
  deactivationsIterator: Iterator<BindingDeactivation<TActivated>>,
): Promise<void> {
  const resolvedValue: SyncResolved<TActivated> = await value;

  let deactivationIteratorResult: IteratorResult<
    BindingDeactivation<TActivated>
  > = deactivationsIterator.next();

  while (deactivationIteratorResult.done !== true) {
    await deactivationIteratorResult.value(resolvedValue);

    deactivationIteratorResult = deactivationsIterator.next();
  }
}
