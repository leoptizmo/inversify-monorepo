import { InversifyHttpWorld } from '../../common/models/InversifyHttpWorld';

export function getServerResponseOrFail(
  this: InversifyHttpWorld,
  alias: string,
): Response {
  const response: Response | undefined = this.serverResponses.get(alias);

  if (response === undefined) {
    throw new Error('Server response not found');
  }

  return response;
}
