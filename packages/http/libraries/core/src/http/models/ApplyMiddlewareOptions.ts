import { Newable } from 'inversify';

import { Middleware } from '../middleware/model/Middleware';
import { MiddlewarePhase } from '../middleware/model/MiddlewarePhase';

export interface ApplyMiddlewareOptions {
  phase: MiddlewarePhase;
  middleware: Newable<Middleware> | Newable<Middleware>[];
}
