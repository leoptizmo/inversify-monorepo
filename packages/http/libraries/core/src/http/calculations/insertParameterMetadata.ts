import { ControllerMethodParameterMetadata } from '../../routerExplorer/model/ControllerMethodParameterMetadata';

export function insertParameterMetadata(
  parameterMetadataList: ControllerMethodParameterMetadata[],
  newParameterMetadata: ControllerMethodParameterMetadata,
): void {
  let i: number = 0;

  while (
    i < parameterMetadataList.length &&
    (parameterMetadataList[i] as ControllerMethodParameterMetadata).index <
      newParameterMetadata.index
  ) {
    i++;
  }

  parameterMetadataList.splice(i, 0, newParameterMetadata);
}
