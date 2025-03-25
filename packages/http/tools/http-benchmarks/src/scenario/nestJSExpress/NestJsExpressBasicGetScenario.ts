import { BaseK6Scenario } from '../k6/BaseK6Scenario';
import { Platform } from '../models/Platform';

export class NestJsExpressBasicGetScenario extends BaseK6Scenario {
  constructor() {
    super(
      Platform.nestJsExpress,
      'src/k6/scenario/BasicGetScenario.ts',
      'lib/cjs/scenario/nestJSExpress/setUpNestJsExpressBasicGetScenario.js',
    );
  }
}
