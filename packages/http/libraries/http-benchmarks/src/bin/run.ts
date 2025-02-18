#!/usr/bin/env node

const MS_PER_SCENARIO: number = 1000;

import {
  buildBenchmark,
  printBenchmarkResults,
} from '@inversifyjs/benchmark-utils';
import { Bench } from 'tinybench';

import { ExpressBasicGetScenario } from '../scenario/express/ExpressBasicGetScenario';
import { FastifyBasicGetScenario } from '../scenario/fastify/FastifyBasicGetScenario';
import { Inversify6ExpressBasicGetScenario } from '../scenario/inversify6Express/Inversify6ExpressBasicGetScenario';
import { NestJsExpressBasicGetScenario } from '../scenario/nestJSExpress/NestJsExpressBasicGetScenario';
import { NestJsFastifyBasicGetScenario } from '../scenario/nestJSFastify/NestJsFastifyBasicGetScenario';

export async function run(): Promise<void> {
  // Run basic get request scenarios
  {
    const benchmark: Bench = buildBenchmark({
      benchOptions: {
        name: 'Basic Get Request',

        time: MS_PER_SCENARIO,
      },
      scenarios: [
        new Inversify6ExpressBasicGetScenario(),
        new ExpressBasicGetScenario(),
        new FastifyBasicGetScenario(),
        new NestJsExpressBasicGetScenario(),
        new NestJsFastifyBasicGetScenario(),
      ],
    });

    await benchmark.run();

    printBenchmarkResults(benchmark);
  }
}
