import { Warrior } from './Warrior';

export interface WarriorWithQuery extends Warrior {
  filter: string;
}
