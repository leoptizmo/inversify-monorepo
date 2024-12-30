import { Container } from 'inversify';

interface Weapon {
  readonly damage: number;
}

export class Katana implements Weapon {
  public readonly damage: number = 10;
}

export class Shuriken implements Weapon {
  public readonly damage: number = 5;
}

// Begin-example
const container: Container = new Container();
container.bind<Weapon>('Weapon').to(Katana).whenTargetNamed('japanese');
container.bind<Weapon>('Weapon').to(Shuriken).whenTargetNamed('chinese');

const katana: Weapon = container.getNamed<Weapon>('Weapon', 'japanese');
const shuriken: Weapon = container.getNamed<Weapon>('Weapon', 'chinese');
// End-example

export { katana, shuriken };
