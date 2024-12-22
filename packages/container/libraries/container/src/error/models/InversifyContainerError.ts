import { InversifyContainerErrorKind } from './InversifyContainerErrorKind';

export const isAppErrorSymbol: unique symbol = Symbol.for(
  '@inversifyjs/container/InversifyContainerError',
);

export class InversifyContainerError extends Error {
  public [isAppErrorSymbol]: true;

  public kind: InversifyContainerErrorKind;

  constructor(
    kind: InversifyContainerErrorKind,
    message?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);

    this[isAppErrorSymbol] = true;
    this.kind = kind;
  }

  public static is(value: unknown): value is InversifyContainerError {
    return (
      typeof value === 'object' &&
      value !== null &&
      (value as Record<string | symbol, unknown>)[isAppErrorSymbol] === true
    );
  }

  public static isErrorOfKind(
    value: unknown,
    kind: InversifyContainerErrorKind,
  ): value is InversifyContainerError {
    return InversifyContainerError.is(value) && value.kind === kind;
  }
}
