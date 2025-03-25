import { Scenario } from '@inversifyjs/benchmark-utils';
import { ChildProcess, exec, spawn } from 'child_process';
import { promisify } from 'util';

import { K6Summary } from '../../k6/model/K6Summary';
import { Platform } from '../models/Platform';

const execPromise: (
  command: string,
) => Promise<{ stdout: string; stderr: string }> = promisify(exec);

async function sleep(ms: number = 2000): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve, ms));
}

export abstract class BaseK6Scenario implements Scenario<Platform, K6Summary> {
  readonly #benchFile: string;
  readonly #serverFile: string;
  #serverProcess!: ChildProcess;

  constructor(
    public readonly platform: Platform,
    benchFile: string,
    serverFile: string,
  ) {
    this.#benchFile = benchFile;
    this.#serverFile = serverFile;
  }

  public async execute(): Promise<K6Summary> {
    const { stdout }: { stdout: string; stderr: string } = await execPromise(
      `k6 run --quiet ${this.#benchFile}`,
    );

    return {
      ...JSON.parse(stdout),
      name: this.platform,
    } as K6Summary;
  }

  public async setUp(): Promise<void> {
    this.#serverProcess = spawn('node', [this.#serverFile], {
      detached: true,
    });

    await sleep();
  }

  public async tearDown(): Promise<void> {
    this.#serverProcess.kill();
  }
}
