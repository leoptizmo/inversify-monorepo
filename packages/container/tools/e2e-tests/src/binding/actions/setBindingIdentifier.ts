import { InversifyWorld } from '../../common/models/InversifyWorld';
import { BindingIdentifierParameter } from '../models/BindingIdentifierParameter';

export function setBindingIdentifier(
  this: InversifyWorld,
  alias: string,
  bindingIdentifier: BindingIdentifierParameter,
): void {
  this.entities.bindingIdentifiers.set(alias, bindingIdentifier);
}
