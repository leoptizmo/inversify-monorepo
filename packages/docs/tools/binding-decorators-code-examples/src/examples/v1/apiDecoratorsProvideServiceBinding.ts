/* eslint-disable @typescript-eslint/no-unused-vars */
import { provide } from '@inversifyjs/binding-decorators';
import { inject, injectable } from 'inversify';

// Begin-example
@injectable()
@provide('Katana')
class Katana {
  public readonly damage: number = 10;
}

@injectable()
@provide('Ninja')
class Ninja {
  constructor(
    @inject(Katana)
    public readonly katana: Katana,
  ) {}
}
