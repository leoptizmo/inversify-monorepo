import { BaseK6Scenario } from '../k6/BaseK6Scenario';
import { Platform } from '../models/Platform';

export class NestJsFastifyBasicGetScenario extends BaseK6Scenario {
  constructor() {
    super(
      Platform.nestJsFastify,
      'src/k6/scenario/BasicGetScenario.ts',
      'lib/cjs/scenario/nestJSFastify/setUpNestJsFastifyBasicGetScenario.js',
    );
  }
}
