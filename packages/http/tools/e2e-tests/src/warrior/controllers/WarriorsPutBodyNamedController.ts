import { body, controller, PUT } from '@inversifyjs/http-core';

import { WarriorCreationResponse } from '../models/WarriorCreationResponse';

@controller('/warriors')
export class WarriorsPutBodyNamedController {
  @PUT()
  public async updateWarrior(
    @body('name') name: string,
  ): Promise<WarriorCreationResponse> {
    return {
      damage: 10,
      health: 100,
      name: name,
      range: 1,
      speed: 10,
      type: 'Melee',
    };
  }
}
