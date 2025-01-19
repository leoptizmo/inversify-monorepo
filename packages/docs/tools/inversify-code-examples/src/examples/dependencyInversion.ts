// Is-inversify-import-example
import { Container, inject, injectable } from 'inversify';

interface Weapon {
  damage: number;
}

const weaponServiceId: symbol = Symbol.for('WeaponServiceId');

@injectable()
class Katana {
  public readonly damage: number = 10;
}

@injectable()
class Ninja {
  constructor(
    @inject(weaponServiceId)
    public readonly weapon: Weapon,
  ) {}
}

const container: Container = new Container();

container.bind(Ninja).toSelf();
container.bind(weaponServiceId).to(Katana);

const ninja: Ninja = container.get(Ninja);

console.log(ninja.weapon.damage); // Prints 10
// End-example

export { ninja };
