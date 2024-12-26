import { Container, inject, injectable } from 'inversify';

interface Weapon {
  damage: number;
}

@injectable()
class Katana {
  public readonly damage: number = 10;
}

@injectable()
class Ninja {
  constructor(
    @inject(Katana)
    public readonly weapon: Weapon,
  ) {}
}

const container: Container = new Container();

container.bind(Ninja).toSelf();
container.bind(Katana).toSelf();

const ninja: Ninja = container.get(Ninja);

console.log(ninja.weapon.damage); // Prints 10
// End-of-example

export { ninja };
