import { serve } from '@hono/node-server';
import { InversifyHonoHttpAdapter } from '@inversifyjs/http-hono';
import { Hono } from 'hono';
import { Container } from 'inversify';

import { DEFAULT_PORT } from '../../constant/defaultPort';
import { AppController } from '../currentInversify/AppController';

async function setUpCurrentInversifyHonoBasicGetScenario(): Promise<void> {
  const container: Container = new Container({ defaultScope: 'Singleton' });

  container.bind(AppController).toSelf();

  const adapter: InversifyHonoHttpAdapter = new InversifyHonoHttpAdapter(
    container,
    {
      logger: false,
    },
  );

  const app: Hono = await adapter.build();

  serve({
    fetch: app.fetch,
    port: DEFAULT_PORT,
  });
}

void setUpCurrentInversifyHonoBasicGetScenario();
