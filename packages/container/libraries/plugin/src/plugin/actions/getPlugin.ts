import { getPluginRegistry } from '../../registry/actions/getPluginRegistry';
import { Plugin } from '../models/Plugin';

export function getPlugin(handle: symbol): Plugin | undefined {
  return getPluginRegistry().get(handle);
}
