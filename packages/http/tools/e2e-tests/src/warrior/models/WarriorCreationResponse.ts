import { Warrior } from './Warrior';

export interface WarriorCreationResponse extends Warrior {
  name: string;
  type: string;
}
