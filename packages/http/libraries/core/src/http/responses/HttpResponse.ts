import { Stream } from 'node:stream';

import { HttpStatusCode } from './HttpStatusCode';

const isHttpResponseSymbol: unique symbol = Symbol.for(
  '@inversifyjs/http-core/HttpResponse',
);

export class HttpResponse {
  public [isHttpResponseSymbol]: true;

  constructor(
    public readonly statusCode: HttpStatusCode,
    public body?: object | string | number | boolean | Stream,
  ) {
    this[isHttpResponseSymbol] = true;
  }

  public static is(value: unknown): value is HttpResponse {
    return (
      typeof value === 'object' &&
      value !== null &&
      (value as Record<string | symbol, unknown>)[isHttpResponseSymbol] === true
    );
  }
}
