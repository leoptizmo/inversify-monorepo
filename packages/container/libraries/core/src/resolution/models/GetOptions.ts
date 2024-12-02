import { MetadataName } from '../../metadata/models/MetadataName';
import { GetOptionsTagConstraint } from './GetOptionsTagConstraint';

export interface GetOptions {
  name?: MetadataName;
  optional?: boolean;
  tag?: GetOptionsTagConstraint;
}
