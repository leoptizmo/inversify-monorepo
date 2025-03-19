export const bindingIdentifierSymbol: symbol = Symbol.for(
  '@inversifyjs/container/bindingIdentifier',
);

export interface BindingIdentifier {
  readonly [bindingIdentifierSymbol]: true;
  readonly id: number;
}
