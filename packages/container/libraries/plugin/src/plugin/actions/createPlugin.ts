import { Plugin } from '../models/Plugin';
import { setPlugin } from './setPlugin';

export function createPlugin(plugin: Plugin): symbol {
  const handle: symbol = Symbol();

  setPlugin(handle, plugin);

  return handle;
}
