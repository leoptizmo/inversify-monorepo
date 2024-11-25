import { ServiceIdentifier } from '@inversifyjs/common';

import { PlanBindingNode } from './PlanBindingNode';
import { PlanServiceNodeParent } from './PlanServiceNodeParent';

export interface PlanServiceNode {
  readonly bindings: PlanBindingNode[];
  readonly parent: PlanServiceNodeParent | undefined;
  readonly serviceIdentifier: ServiceIdentifier;
}
