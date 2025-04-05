import { Warrior } from './Warrior';
import { WarriorCreationResponseType } from './WarriorCreationResponseType';

export interface WarriorCreationResponse extends Warrior {
  name: string;
  type: WarriorCreationResponseType;
}
