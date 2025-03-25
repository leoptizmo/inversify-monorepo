import { controller, POST } from '@inversifyjs/http-core';

import { Warrior } from '../models/Warrior';

@controller('/warriors')
export class WarriorsPostController {
  @POST()
  public async createWarrior(): Promise<Warrior> {
    return {
      damage: 10,
      health: 100,
      range: 1,
      speed: 10,
    };
  }
}
