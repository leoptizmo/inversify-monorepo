import { controller, OPTIONS, query } from '@inversifyjs/http-core';

import { WarriorWithQuery } from '../models/WarriorWithQuery';

@controller('/warriors')
export class WarriorsOptionsQueryController {
  @OPTIONS()
  public async optionsWarrior(
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
