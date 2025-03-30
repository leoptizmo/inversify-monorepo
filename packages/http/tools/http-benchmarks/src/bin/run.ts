#!/usr/bin/env node

import {
  buildBenchmark,
  printBenchmarkResults,
} from '@inversifyjs/benchmark-utils';
import { Scenario } from '@inversifyjs/benchmark-utils';
import { Bench } from 'tinybench';

import { executeHttpBenchmark } from '../benchmark/calculations/executeHttpBenchmark';
import { printHttpBenchmarkResults } from '../benchmark/calculations/printHttpBenchmarkResults';
import { K6Summary } from '../k6/model/K6Summary';
import { CurrentInversifyExpressBasicGetScenario } from '../scenario/currentInversifyExpress/CurrentInversifyExpressBasicGetScenario';
import { CurrentInversifyHonoBasicGetScenario } from '../scenario/currentInversifyHono/CurrentInversifyHonoBasicGetScenario';
import { ExpressBasicGetScenario } from '../scenario/express/ExpressBasicGetScenario';
import { FastifyBasicGetScenario } from '../scenario/fastify/FastifyBasicGetScenario';
import { HonoBasicGetScenario } from '../scenario/hono/HonoBasicGetScenario';
import { Platform } from '../scenario/models/Platform';
import { NestJsExpressBasicGetScenario } from '../scenario/nestJSExpress/NestJsExpressBasicGetScenario';
import { NestJsFastifyBasicGetScenario } from '../scenario/nestJSFastify/NestJsFastifyBasicGetScenario';

export async function run(): Promise<void> {
  // Run express basic get request scenarios
  {
    const scenarioList: Scenario<Platform, K6Summary>[] = [
      new CurrentInversifyExpressBasicGetScenario(),
      new ExpressBasicGetScenario(),
      new NestJsExpressBasicGetScenario(),
    ];

    const summaryList: K6Summary[] = await executeHttpBenchmark(scenarioList);

    printHttpBenchmarkResults('Express Basic Get Request', summaryList);
  }

  // Run fastify basic get request scenarios
  {
    const scenarioList: Scenario<Platform, K6Summary>[] = [
      new FastifyBasicGetScenario(),
      new NestJsFastifyBasicGetScenario(),
    ];

    const summaryList: K6Summary[] = await executeHttpBenchmark(scenarioList);

    printHttpBenchmarkResults('Fastify Basic Get Request', summaryList);
  }

  // Run Hono basic get request scenarios
  {
    const benchmark: Bench = buildBenchmark({
      benchOptions: {
        name: 'Hono Basic Get Request',
        time: MS_PER_SCENARIO,
      },
      scenarios: [
        new CurrentInversifyHonoBasicGetScenario(),
        new HonoBasicGetScenario(),
      ],
    });

    await benchmark.run();

    printBenchmarkResults(benchmark);
  }
}
