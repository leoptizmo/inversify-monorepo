import {
  controller,
  DELETE,
  HttpStatusCode,
  statusCode,
} from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsDeleteStatusCodeController {
  @statusCode(HttpStatusCode.NO_CONTENT)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
