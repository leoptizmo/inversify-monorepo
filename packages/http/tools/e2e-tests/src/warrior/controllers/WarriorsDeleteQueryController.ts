import { controller, DELETE, query } from '@inversifyjs/http-core';

import { WarriorWithQuery } from '../models/WarriorWithQuery';

@controller('/warriors')
export class WarriorsDeleteQueryController {
  @DELETE()
  public async deleteWarrior(
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
