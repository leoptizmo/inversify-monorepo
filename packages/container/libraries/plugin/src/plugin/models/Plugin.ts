import { PluginApi } from './PluginApi';

export interface Plugin {
  load(api: PluginApi): void;
  supports(version: string): boolean;
}
