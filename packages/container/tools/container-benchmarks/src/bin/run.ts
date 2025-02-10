#!/usr/bin/env node

const MS_PER_SCENARIO: number = 1000;

import { Bench } from 'tinybench';

import { buildBenchmark } from '../benchmark/calculations/buildBenchmark';
import { Inversify6GetComplexServiceInSingletonScope } from '../scenario/Inversify6/Inversify6GetComplexServiceInSingletonScope';
import { Inversify6GetComplexServiceInTransientScope } from '../scenario/Inversify6/Inversify6GetComplexServiceInTransientScope';
import { Inversify6GetServiceInSingletonScope } from '../scenario/Inversify6/Inversify6GetServiceInSingletonScope';
import { Inversify6GetServiceInTransientScope } from '../scenario/Inversify6/Inversify6GetServiceInTransientScope';
import { InversifyCurrentGetComplexServiceInSingletonScope } from '../scenario/inversifyCurrent/InversifyCurrentGetComplexServiceInSingletonScope';
import { InversifyCurrentGetComplexServiceInTransientScope } from '../scenario/inversifyCurrent/InversifyCurrentGetComplexServiceInTransientScope';
import { InversifyCurrentGetServiceInSingletonScope } from '../scenario/inversifyCurrent/InversifyCurrentGetServiceInSingletonScope';
import { InversifyCurrentGetServiceInTransientScope } from '../scenario/inversifyCurrent/InversifyCurrentGetServiceInTransientScope';
import { NestCoreGetComplexServiceInSingletonScopeScenario } from '../scenario/nestCore/NestCoreGetComplexServiceInSingletonScopeScenario';
import { NestCoreGetComplexServiceInTransientScopeScenario } from '../scenario/nestCore/NestCoreGetComplexServiceInTransientScopeScenario';
import { NestCoreGetServiceInSingletonScopeScenario } from '../scenario/nestCore/NestCoreGetServiceInSingletonScopeScenario';
import { NestCoreGetServiceInTransientScopeScenario } from '../scenario/nestCore/NestCoreGetServiceInTransientScopeScenario';
import { TsyringeGetComplexServiceInSingletonScope } from '../scenario/tsyringe/TsyringeGetComplexServiceInSingletonScope';
import { TsyringeGetComplexServiceInTransientScope } from '../scenario/tsyringe/TsyringeGetComplexServiceInTransientScope';
import { TsyringeGetServiceInSingletonScope } from '../scenario/tsyringe/TsyringeGetServiceInSingletonScope';
import { TsyringeGetServiceInTransientScope } from '../scenario/tsyringe/TsyringeGetServiceInTransientScope';

export async function run(): Promise<void> {
  // Run get service in singleton scope scenarios
  {
    const benchmark: Bench = buildBenchmark({
      benchOptions: {
        name: 'Get service in singleton scope',
        time: MS_PER_SCENARIO,
      },
      scenarios: [
        new InversifyCurrentGetServiceInSingletonScope(),
        new Inversify6GetServiceInSingletonScope(),
        new NestCoreGetServiceInSingletonScopeScenario(),
        new TsyringeGetServiceInSingletonScope(),
      ],
    });

    await benchmark.run();

    console.log(benchmark.name);
    console.table(benchmark.table());
  }

  // Run get service in transient scope scenarios
  {
    const benchmark: Bench = buildBenchmark({
      benchOptions: {
        name: 'Get service in transient scope',
        time: MS_PER_SCENARIO,
      },
      scenarios: [
        new InversifyCurrentGetServiceInTransientScope(),
        new Inversify6GetServiceInTransientScope(),
        new NestCoreGetServiceInTransientScopeScenario(),
        new TsyringeGetServiceInTransientScope(),
      ],
    });

    await benchmark.run();

    console.log(benchmark.name);
    console.table(benchmark.table());
  }

  // Run get complex service in singleton scope scenarios
  {
    const benchmark: Bench = buildBenchmark({
      benchOptions: {
        name: 'Get complex service in singleton scope',
        time: MS_PER_SCENARIO,
      },
      scenarios: [
        new InversifyCurrentGetComplexServiceInSingletonScope(),
        new Inversify6GetComplexServiceInSingletonScope(),
        new NestCoreGetComplexServiceInSingletonScopeScenario(),
        new TsyringeGetComplexServiceInSingletonScope(),
      ],
    });

    await benchmark.run();

    console.log(benchmark.name);
    console.table(benchmark.table());
  }

  // Run get complex service in transient scope scenarios
  {
    const benchmark: Bench = buildBenchmark({
      benchOptions: {
        name: 'Get complex service in transient scope',
        time: MS_PER_SCENARIO,
      },
      scenarios: [
        new InversifyCurrentGetComplexServiceInTransientScope(),
        new Inversify6GetComplexServiceInTransientScope(),
        new NestCoreGetComplexServiceInTransientScopeScenario(),
        new TsyringeGetComplexServiceInTransientScope(),
      ],
    });

    await benchmark.run();

    console.log(benchmark.name);
    console.table(benchmark.table());
  }
}
