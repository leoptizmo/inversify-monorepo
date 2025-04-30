import { PluginDispose } from './plugins/PluginDispose';

declare module 'inversify' {
  interface Container {
    [Symbol.asyncDispose](): Promise<void>;
    [Symbol.dispose](): void;
  }
}

export { PluginDispose };
