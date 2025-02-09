/* eslint-disable @typescript-eslint/no-unused-vars */
import { provide } from '@inversifyjs/binding-decorators';
import { BindInWhenOnFluentSyntax, inject, injectable } from 'inversify';

// Begin-example
@injectable()
@provide('Katana', (bind: BindInWhenOnFluentSyntax<Katana>) => {
  bind.inSingletonScope().whenNamed('GoldenKatana');
})
class Katana {
  public readonly damage: number = 10;
}
