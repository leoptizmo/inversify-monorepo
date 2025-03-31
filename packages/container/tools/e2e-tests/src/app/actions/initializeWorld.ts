import { InversifyWorld } from '../../common/models/InversifyWorld';
import { Writable } from '../../common/models/Writable';

export function initializeWorld(this: Writable<Partial<InversifyWorld>>): void {
  this.containerRequests = {
    get: new Map(),
  };
  this.entities = {
    bindingIdentifiers: new Map(),
    bindings: new Map(),
    containers: new Map(),
  };
}
