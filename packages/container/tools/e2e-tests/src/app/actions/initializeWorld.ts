import { InversifyWorld } from '../../common/models/InversifyWorld';
import { Writable } from '../../common/models/Writable';

export function initializeWorld(this: Writable<Partial<InversifyWorld>>): void {
  this.containerRequests = {
    get: new Map(),
  };
  this.entities = {
    bindings: new Map(),
    containers: new Map(),
  };
}
