// Shift-line-spaces-2
// Is-inversify-import-example
import { Container, preDestroy } from 'inversify7';

void (async () => {
  // Begin-example
  interface Weapon {
    damage: number;
  }

  class Katana implements Weapon {
    readonly #damage: number = 10;

    public get damage(): number {
      return this.#damage;
    }

    @preDestroy()
    public onDeactivation(): void {
      console.log(`Deactivating weapon with damage ${this.damage.toString()}`);
    }
  }

  const container: Container = new Container();

  container.bind<Weapon>('Weapon').to(Katana).inSingletonScope();

  container.get('Weapon');

  await container.unbind('Weapon');
  // End-example
})();
