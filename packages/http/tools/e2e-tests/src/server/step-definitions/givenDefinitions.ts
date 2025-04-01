import http, { RequestListener } from 'node:http';
import { AddressInfo } from 'node:net';

import { Given } from '@cucumber/cucumber';
import { InversifyExpressHttpAdapter } from '@inversifyjs/http-express';
import express from 'express';
import { Container } from 'inversify';

import { defaultAlias } from '../../common/models/defaultAlias';
import { InversifyHttpWorld } from '../../common/models/InversifyHttpWorld';
import { getContainerOrFail } from '../../container/calculations/getContainerOrFail';
import { setServer } from '../actions/setServer';
import { Server } from '../models/Server';
import { ServerKind } from '../models/ServerKind';

async function buildExpressServer(container: Container): Promise<Server> {
  const adapter: InversifyExpressHttpAdapter = new InversifyExpressHttpAdapter(
    container,
    { logger: true },
  );

  const application: express.Application = await adapter.build();
  const httpServer: http.Server = http.createServer(
    application as RequestListener,
  );

  return new Promise<Server>(
    (resolve: (value: Server | PromiseLike<Server>) => void) => {
      httpServer.listen(0, '127.0.0.1', () => {
        const address: AddressInfo | string | null = httpServer.address();

        if (address === null || typeof address === 'string') {
          throw new Error('Failed to get server address');
        }

        const server: Server = {
          host: address.address,
          port: address.port,
          shutdown: async (): Promise<void> => {
            await new Promise<void>(
              (
                resolve: (value: void | PromiseLike<void>) => void,
                reject: (reason?: unknown) => void,
              ) => {
                httpServer.close((error: Error | undefined) => {
                  if (error !== undefined) {
                    reject(error);
                  } else {
                    resolve();
                  }
                });
              },
            );
          },
        };

        resolve(server);
      });
    },
  );
}

async function givenServer(
  this: InversifyHttpWorld,
  serverKind: ServerKind,
  containerAlias?: string,
  serverAlias?: string,
): Promise<void> {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;
  const parsedServerAlias: string = serverAlias ?? defaultAlias;

  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  switch (serverKind) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    case ServerKind.express: {
      const server: Server = await buildExpressServer(container);

      setServer.bind(this)(parsedServerAlias, server);
    }
  }
}

Given<InversifyHttpWorld>(
  'a(n) "{serverKind}" server from container',
  async function (serverKind: ServerKind): Promise<void> {
    await givenServer.bind(this)(serverKind);
  },
);
