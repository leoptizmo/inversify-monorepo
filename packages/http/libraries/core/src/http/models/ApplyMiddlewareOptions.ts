import { Newable } from 'inversify';

import { Middleware } from './Middleware';

export interface ApplyMiddlewareOptions {
  phase: 'preHandler' | 'postHandler';
  middleware: Newable<Middleware> | Newable<Middleware>[];
}
