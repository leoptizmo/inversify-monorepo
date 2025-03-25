import { InversifyHttpWorld } from '../../common/models/InversifyHttpWorld';

export function setServerRequest(
  this: InversifyHttpWorld,
  alias: string,
  request: Request,
): void {
  this.serverRequests.set(alias, request);
}
