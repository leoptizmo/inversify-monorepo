import { serve } from '@hono/node-server';
import { Context, Hono } from 'hono';

import { DEFAULT_PORT } from '../../constant/defaultPort';

async function setUpHonoBasicGetScenario(): Promise<void> {
  const app: Hono = new Hono();

  app.get('/', (ctx: Context) => {
    return ctx.text('ok');
  });

  serve({
    fetch: app.fetch,
    port: DEFAULT_PORT,
  });
}

void setUpHonoBasicGetScenario();
