import { InversifyHttpWorld } from '../../common/models/InversifyHttpWorld';

export function setServerResponse(
  this: InversifyHttpWorld,
  alias: string,
  response: Response,
): void {
  this.serverResponses.set(alias, response);
}
