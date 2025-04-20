import {
  controller,
  HttpStatusCode,
  OPTIONS,
  statusCode,
} from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsOptionsStatusCodeController {
  @statusCode(HttpStatusCode.NO_CONTENT)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
