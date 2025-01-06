import { InversifyWorld } from '../../common/models/InversifyWorld';
import { BindingParameter } from '../models/BindingParameter';

export function setBinding(
  this: InversifyWorld,
  alias: string,
  binding: BindingParameter,
): void {
  this.entities.bindings.set(alias, binding);
}
