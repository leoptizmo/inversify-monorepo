import { injectable } from '@inversifyjs/core';

import { Sword } from './Sword';

@injectable()
export class DualWieldSwordsman {
  constructor(
    public leftSword: Sword,
    public rightSword: Sword,
  ) {}
}
