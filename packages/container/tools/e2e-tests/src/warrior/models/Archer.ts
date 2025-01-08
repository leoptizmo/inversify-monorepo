import { inject, injectable, named, tagged } from '@inversifyjs/core';

import { Bow } from './Bow';

@injectable()
export class Archer {
  constructor(
    @inject('weapon')
    @named('bow')
    @tagged('kind', 'bow')
    public bow: Bow,
  ) {}
}
