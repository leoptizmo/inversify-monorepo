import { controller, POST, query } from '@inversifyjs/http-core';

import { WarriorWithQuery } from '../models/WarriorWithQuery';

@controller('/warriors')
export class WarriorsPostQueryNamedController {
  @POST()
  public async postWarrior(
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
