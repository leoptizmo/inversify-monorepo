import { controller, headers, PATCH } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPatchHeadersController {
  @PATCH()
  public async patchWarrior(
    @headers() headers: Record<string, string>,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': headers['x-test-header'] as string,
    };
  }
}
