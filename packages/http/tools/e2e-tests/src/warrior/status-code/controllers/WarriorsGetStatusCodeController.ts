import {
  controller,
  GET,
  HttpStatusCode,
  statusCode,
} from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsGetStatusCodeController {
  @statusCode(HttpStatusCode.NO_CONTENT)
  @GET()
  public async getWarrior(): Promise<void> {}
}
