export const bindingIdentifierSymbol: symbol = Symbol.for(
  '@gritcode/inversifyjs-container/bindingIdentifier',
);

export interface BindingIdentifier {
  readonly [bindingIdentifierSymbol]: true;
  readonly id: number;
}
