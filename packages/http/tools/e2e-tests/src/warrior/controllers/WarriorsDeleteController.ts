import { controller, DELETE } from '@inversifyjs/http-core';

import { Warrior } from '../models/Warrior';

@controller('/warriors')
export class WarriorsDeleteController {
  @DELETE()
  public async deleteWarrior(): Promise<Warrior> {
    return {
      damage: 10,
      health: 100,
      range: 1,
      speed: 10,
    };
  }
}
