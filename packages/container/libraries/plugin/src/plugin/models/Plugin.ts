import { PluginApi } from './PluginApi';
import { PluginContext } from './PluginContext';

export const isPlugin: symbol = Symbol.for('@inversifyjs/plugin/isPlugin');

export abstract class Plugin {
  public readonly [isPlugin]: true = true as const;

  protected readonly _context: PluginContext;

  constructor(context: PluginContext) {
    this._context = context;
  }

  public abstract load(api: PluginApi): void;
}
