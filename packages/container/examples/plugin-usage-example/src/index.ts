import { pluginExample } from '@inversifyjs/plugin-example';
import { Container } from 'inversify';

const container: Container = new Container();

// TODO: Implement container.register(PluginExample) to register the plugin

container[pluginExample]();
