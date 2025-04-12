import { Container } from '@inversifyjs/container';

export interface PluginApi {
  define(
    name: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    method: (this: Container, ...args: any[]) => unknown,
  ): void;
}
