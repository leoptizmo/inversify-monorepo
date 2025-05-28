import { GetPlanOptions, PlanResult } from '@gritcode/inversifyjs-core';

export interface PluginApi {
  define(
    name: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    method: (...args: any[]) => unknown,
  ): void;
  onPlan(handler: (options: GetPlanOptions, result: PlanResult) => void): void;
}
