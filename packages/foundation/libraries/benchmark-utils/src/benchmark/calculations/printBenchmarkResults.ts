import { Bench, Task } from 'tinybench';

const FIXED_DECIMALS: number = 3;

export function printBenchmarkResults(benchmark: Bench): void {
  console.log(benchmark.name);
  console.table(benchmark.table());

  const tasks: Task[] = benchmark.tasks;

  const referenceTask: Task | undefined = tasks[0];
  const referenceMean: number | undefined =
    referenceTask?.result?.throughput.mean;

  if (referenceTask !== undefined && referenceMean !== undefined) {
    for (const task of tasks.slice(1)) {
      const mean: number | undefined = task.result?.throughput.mean;

      if (mean !== undefined) {
        const speedup: number = referenceMean / mean;

        console.log(
          `${referenceTask.name} vs ${task.name} Speedup: ${speedup.toFixed(FIXED_DECIMALS)}x`,
        );
      }
    }
  }
  console.log();
}
