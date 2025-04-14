import {
  controller,
  HttpStatusCode,
  PUT,
  statusCode,
} from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPutStatusCodeController {
  @statusCode(HttpStatusCode.NO_CONTENT)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
