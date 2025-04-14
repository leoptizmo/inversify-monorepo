import {
  controller,
  HttpStatusCode,
  PATCH,
  statusCode,
} from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPatchStatusCodeController {
  @statusCode(HttpStatusCode.NO_CONTENT)
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
