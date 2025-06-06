import { Middleware } from '@inversifyjs/http-core';
import { Context, HonoRequest, Next } from 'hono';
import { injectable } from 'inversify';

@injectable()
export class NextHonoMiddleware
  implements Middleware<HonoRequest, Context, Next, void>
{
  public async execute(_request: HonoRequest, context: Context): Promise<void> {
    // https://hono.dev/docs/guides/middleware#modify-the-response-after-next

    context.res = undefined;

    context.res = new Response(undefined, {
      status: 200,
    });
  }
}
