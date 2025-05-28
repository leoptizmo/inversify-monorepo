// Imports added in order to detrect both modules
import type {} from '@gritcode/inversifyjs-container';
import type {} from 'inversify';

import { PluginDispose } from './plugins/PluginDispose';

declare module '@gritcode/inversifyjs-container' {
  interface Container {
    [Symbol.asyncDispose](): Promise<void>;
    [Symbol.dispose](): void;
  }
}

declare module 'inversify' {
  interface Container {
    [Symbol.asyncDispose](): Promise<void>;
    [Symbol.dispose](): void;
  }
}

export { PluginDispose };
