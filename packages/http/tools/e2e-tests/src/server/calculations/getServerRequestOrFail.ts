import { InversifyHttpWorld } from '../../common/models/InversifyHttpWorld';

export function getServerRequestOrFail(
  this: InversifyHttpWorld,
  alias: string,
): Request {
  const request: Request | undefined = this.serverRequests.get(alias);

  if (request === undefined) {
    throw new Error('Server request not found');
  }

  return request;
}
