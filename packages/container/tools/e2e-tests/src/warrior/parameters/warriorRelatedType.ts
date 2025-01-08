import { defineParameterType } from '@cucumber/cucumber';
import { Newable } from '@inversifyjs/common';

import { Archer } from '../models/Archer';
import { Bow } from '../models/Bow';
import { Sword } from '../models/Sword';

enum WarriorRelatedType {
  archer = 'archer',
  bow = 'bow',
  sword = 'sword',
}

defineParameterType({
  name: 'warriorRelatedType',
  regexp: new RegExp(`(${Object.values(WarriorRelatedType).join('|')})`),
  transformer: function (warriorRelatedType: string): Newable {
    switch (warriorRelatedType as WarriorRelatedType) {
      case WarriorRelatedType.archer:
        return Archer;
      case WarriorRelatedType.bow:
        return Bow;
      case WarriorRelatedType.sword:
        return Sword;
      default:
        throw new Error(`Invalid "${warriorRelatedType}" warrior related type`);
    }
  },
});
