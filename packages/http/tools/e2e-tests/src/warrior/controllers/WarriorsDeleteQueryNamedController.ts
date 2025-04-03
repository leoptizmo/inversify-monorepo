import { controller, DELETE, query } from '@inversifyjs/http-core';

import { WarriorWithQuery } from '../models/WarriorWithQuery';

@controller('/warriors')
export class WarriorsDeleteQueryNamedController {
  @DELETE()
  public async deleteWarrior(
    @query('filter') filter: string,
  ): Promise<WarriorWithQuery> {
    return {
      damage: 10,
      filter,
      health: 100,
      range: 1,
      speed: 10,
    };
  }
}
