import { getPluginRegistry } from '../../registry/actions/getPluginRegistry';
import { Plugin } from '../models/Plugin';

export function setPlugin(handle: symbol, plugin: Plugin): void {
  getPluginRegistry().set(handle, plugin);
}
