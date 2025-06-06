import { controller, GET } from '@inversifyjs/http-core';

import { Warrior } from '../../common/models/Warrior';

@controller('/warriors')
export class WarriorsGetController {
  @GET()
  public async getWarriors(): Promise<Warrior[]> {
    return [
      {
        damage: 10,
        health: 100,
        range: 1,
        speed: 10,
      },
    ];
  }
}
