import { controller, OPTIONS, query } from '@inversifyjs/http-core';

import { WarriorWithQuery } from '../models/WarriorWithQuery';

@controller('/warriors')
export class WarriorsOptionsQueryNamedController {
  @OPTIONS()
  public async optionsWarrior(
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
