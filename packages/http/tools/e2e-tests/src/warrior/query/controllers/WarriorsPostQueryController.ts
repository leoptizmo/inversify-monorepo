import { controller, POST, query } from '@inversifyjs/http-core';

import { WarriorWithQuery } from '../models/WarriorWithQuery';

@controller('/warriors')
export class WarriorsPostQueryController {
  @POST()
  public async postWarrior(
    @query() queryParams: { filter: string },
  ): Promise<WarriorWithQuery> {
    return {
      damage: 10,
      filter: queryParams.filter,
      health: 100,
      range: 1,
      speed: 10,
    };
  }
}
