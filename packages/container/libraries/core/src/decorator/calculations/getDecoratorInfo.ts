import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { DecoratorInfo } from '../models/DecoratorInfo';
import { DecoratorInfoKind } from '../models/DecoratorInfoKind';

export function getDecoratorInfo(
  target: object,
  propertyKey: undefined,
  parameterIndex: number,
): DecoratorInfo;
export function getDecoratorInfo(
  target: object,
  propertyKey: string | symbol,
): DecoratorInfo;
export function getDecoratorInfo(
  target: object,
  propertyKey: string | symbol | undefined,
  parameterIndex?: number | undefined,
): DecoratorInfo;
export function getDecoratorInfo(
  target: object,
  propertyKey: string | symbol | undefined,
  parameterIndex?: number | undefined,
): DecoratorInfo {
  if (parameterIndex === undefined) {
    if (propertyKey === undefined) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.unknown,
        'Unexpected undefined property and index values',
      );
    }

    return {
      kind: DecoratorInfoKind.property,
      property: propertyKey,
      targetClass: target.constructor,
    };
  }

  return {
    index: parameterIndex,
    kind: DecoratorInfoKind.parameter,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    targetClass: target as Function,
  };
}
