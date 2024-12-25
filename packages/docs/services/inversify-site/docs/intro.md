---
sidebar_position: 1
---

# Getting started

Initialize your first container and add some bindings:

:::warning

[Experimental decorators](https://www.typescriptlang.org/tsconfig/#experimentalDecorators) and [Emit Decorator Metadata](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata) options must be enabled in order to use this library.

:::

```ts
import { Container, injectable, inject } from 'inversify';

interface Weapon {
  damage: number
}

@injectable()
class Katana {
  public readonly damage: number = 10;
}

@injectable()
class Ninja {
  constructor (
    @inject(Katana)
    public readonly weapon: Weapon
  ) {}
}

const container: Container = new Container();

container.bind(Ninja).toSelf();
container.bind(Katana).toSelf();

const ninja: Ninja = container.get(Ninja);

console.log(ninja.weapon.damage); // Prints 10
```

`@injectable` allows both `Katana` and `Ninja` classes to be used as container bindings. `@inject` provides metadata with `Ninja` dependencies so the container is aware a `Katana` should be provided as the first argument of `Ninja`'s constructor.

Bindings are provided through the `Container` API.

Whith these two steps, we are ready to initialize our very first ninja!
