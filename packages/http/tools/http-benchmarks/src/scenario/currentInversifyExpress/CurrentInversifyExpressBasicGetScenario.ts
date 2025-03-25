import { BaseK6Scenario } from '../k6/BaseK6Scenario';
import { Platform } from '../models/Platform';

export class CurrentInversifyExpressBasicGetScenario extends BaseK6Scenario {
  constructor() {
    super(
      Platform.currentInversifyExpress,
      'src/k6/scenario/BasicGetScenario.ts',
      'lib/cjs/scenario/currentInversifyExpress/setUpCurrentInversifyExpressBasicGetScenario.js',
    );
  }
}
