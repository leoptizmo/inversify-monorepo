import { body, controller, DELETE } from '@inversifyjs/http-core';

import { WarriorCreationResponse } from '../models/WarriorCreationResponse';
import { WarriorCreationResponseType } from '../models/WarriorCreationResponseType';

@controller('/warriors')
export class WarriorsDeleteBodyNamedController {
  @DELETE()
  public async deleteWarrior(
    @body('name') name: string,
  ): Promise<WarriorCreationResponse> {
    return {
      damage: 10,
      health: 100,
      name: name,
      range: 1,
      speed: 10,
      type: WarriorCreationResponseType.Melee,
    };
  }
}
