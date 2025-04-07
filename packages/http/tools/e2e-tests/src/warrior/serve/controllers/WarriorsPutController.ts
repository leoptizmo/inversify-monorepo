import { controller, PUT } from '@inversifyjs/http-core';

import { Warrior } from '../../common/models/Warrior';

@controller('/warriors')
export class WarriorsPutController {
  @PUT()
  public async updateWarrior(): Promise<Warrior> {
    return {
      damage: 10,
      health: 100,
      range: 1,
      speed: 10,
    };
  }
}
