/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export function decorate(decorators: ClassDecorator[], target: Function): void;
export function decorate(
  decorators: ParameterDecorator[],
  target: Function,
  parameterIndex: number,
): void;
export function decorate(
  decorators: MethodDecorator[] | PropertyDecorator[],
  target: Function,
  property: string | symbol,
): void;
export function decorate(
  decorators:
    | ClassDecorator[]
    | MethodDecorator[]
    | ParameterDecorator[]
    | PropertyDecorator[],
  target: Function,
  parameterIndexOrProperty?: number | string | symbol,
): void {
  if (parameterIndexOrProperty === undefined) {
    // Asume ClassDecorator[]

    Reflect.decorate(decorators as ClassDecorator[], target);
    return;
  }

  if (typeof parameterIndexOrProperty === 'number') {
    // Asume ParameterDecorator[]

    for (const decorator of decorators as ParameterDecorator[]) {
      decorator(target, undefined, parameterIndexOrProperty);
    }

    return;
  }

  Reflect.decorate(
    decorators as MethodDecorator[] | PropertyDecorator[],
    target.prototype as object,
    parameterIndexOrProperty,
  );
}
