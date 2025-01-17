import { Container } from 'inversify';

interface Weapon {
  damage: number;
}

export class Katana implements Weapon {
  public readonly damage: number = 10;
}

// Begin-example
const container: Container = new Container();
container.bind<Weapon>('Weapon').to(Katana).inSingletonScope();
// End-example
