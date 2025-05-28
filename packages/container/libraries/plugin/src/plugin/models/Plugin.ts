import { PluginApi } from './PluginApi';
import { PluginContext } from './PluginContext';

export const isPlugin: unique symbol = Symbol.for(
  '@gritcode/inversifyjs-plugin/isPlugin',
);

export abstract class Plugin<TContainer> {
  public readonly [isPlugin]: true = true as const;

  protected readonly _container: TContainer;
  protected readonly _context: PluginContext;

  constructor(container: TContainer, context: PluginContext) {
    this._container = container;
    this._context = context;
  }

  public abstract load(api: PluginApi): void;
}
