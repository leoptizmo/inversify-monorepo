import { ServiceIdentifier } from '@inversifyjs/common';

import { BindingActivation } from '../../binding/models/BindingActivation';
import { isPromise } from '../../common/calculations/isPromise';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';

export function resolveBindingActivations<TActivated>(
  params: ResolutionParams,
  serviceIdentifier: ServiceIdentifier<TActivated>,
  value: Resolved<TActivated>,
): Resolved<TActivated> {
  const activations: Iterable<BindingActivation<TActivated>> | undefined =
    params.getActivations(serviceIdentifier);

  if (activations !== undefined) {
    if (isPromise(value)) {
      return resolveBindingActivationsFromIteratorAsync(
        value,
        activations[Symbol.iterator](),
      );
    } else {
      return resolveBindingActivationsFromIterator(
        value,
        activations[Symbol.iterator](),
      );
    }
  }

  return value;
}

function resolveBindingActivationsFromIterator<TActivated>(
  value: Awaited<TActivated>,
  activationsIterator: Iterator<BindingActivation<TActivated>>,
): Resolved<TActivated> {
  let activatedValue: Awaited<TActivated> = value;

  let activationIteratorResult: IteratorResult<BindingActivation<TActivated>> =
    activationsIterator.next();

  while (activationIteratorResult.done !== true) {
    const nextActivatedValue: Resolved<TActivated> =
      activationIteratorResult.value(activatedValue);

    if (isPromise(nextActivatedValue)) {
      return resolveBindingActivationsFromIteratorAsync(
        nextActivatedValue,
        activationsIterator,
      );
    } else {
      activatedValue = nextActivatedValue;
    }

    activationIteratorResult = activationsIterator.next();
  }

  return activatedValue;
}

async function resolveBindingActivationsFromIteratorAsync<TActivated>(
  value: Promise<TActivated>,
  activationsIterator: Iterator<BindingActivation<TActivated>>,
): Promise<Awaited<TActivated>> {
  let activatedValue: Awaited<TActivated> = await value;

  let activationIteratorResult: IteratorResult<BindingActivation<TActivated>> =
    activationsIterator.next();

  while (activationIteratorResult.done !== true) {
    activatedValue = await activationIteratorResult.value(activatedValue);

    activationIteratorResult = activationsIterator.next();
  }

  return activatedValue;
}
