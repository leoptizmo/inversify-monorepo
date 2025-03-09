import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import stream from 'node:stream';

import { createLogger, transports } from 'winston';

import { LogLevel } from '../../model/LogLevel';
import { WinstonLoggerAdapter } from './WinstonLoggerAdapter';

class TestStream extends stream.Writable {
  public chunks: unknown[];

  constructor() {
    super({ objectMode: true });

    this.chunks = [];
  }

  public override _write(
    chunk: unknown,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ) {
    this.chunks.push(chunk);

    callback();
  }
}

describe(WinstonLoggerAdapter.name, () => {
  let stream: TestStream;
  let winstonLoggerAdapter: WinstonLoggerAdapter;

  beforeAll(() => {
    stream = new TestStream();

    winstonLoggerAdapter = new WinstonLoggerAdapter(
      createLogger({
        transports: [new transports.Stream({ stream })],
      }),
    );
  });

  describe('.log', () => {
    describe('when called', () => {
      beforeAll(() => {
        winstonLoggerAdapter.log(LogLevel.INFO, 'test', {
          context: 'context-test',
        });
      });

      afterAll(() => {
        stream.chunks = [];
      });

      it('should write log to stream', () => {
        const expectedChunks: unknown[] = [
          expect.objectContaining({
            context: 'context-test',
            level: 'info',
            message: 'test',
          }),
        ];

        expect(stream.chunks).toStrictEqual(expectedChunks);
      });
    });
  });
});
