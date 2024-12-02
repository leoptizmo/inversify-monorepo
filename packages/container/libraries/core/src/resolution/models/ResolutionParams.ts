import { PlanResult } from '../../planning/models/PlanResult';
import { ResolutionContext } from './ResolutionContext';

export interface ResolutionParams {
  context: ResolutionContext;
  planResult: PlanResult;
  requestScopeCache: Map<number, unknown>;
}
