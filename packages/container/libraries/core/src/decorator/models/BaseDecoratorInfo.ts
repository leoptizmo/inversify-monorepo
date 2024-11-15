export interface BaseDecoratorInfo<TKind> {
  kind: TKind;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  targetClass: Function;
}
