import {
  controller,
  HttpStatusCode,
  POST,
  statusCode,
} from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPostStatusCodeController {
  @statusCode(HttpStatusCode.NO_CONTENT)
  @POST()
  public async postWarrior(): Promise<void> {}
}
