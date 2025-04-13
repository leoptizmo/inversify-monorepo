import {
  controller,
  HEAD,
  HttpStatusCode,
  statusCode,
} from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsHeadStatusCodeController {
  @statusCode(HttpStatusCode.NO_CONTENT)
  @HEAD()
  public async headWarrior(): Promise<void> {}
}
