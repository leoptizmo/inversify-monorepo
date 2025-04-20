import { InversifyContainerError } from '../../error/models/InversifyContainerError';
import { InversifyContainerErrorKind } from '../../error/models/InversifyContainerErrorKind';
import { Snapshot } from '../../snapshot/models/Snapshot';
import { ServiceReferenceManager } from './ServiceReferenceManager';

export class SnapshotManager {
  readonly #serviceReferenceManager: ServiceReferenceManager;
  readonly #snapshots: Snapshot[];

  constructor(serviceReferenceManager: ServiceReferenceManager) {
    this.#serviceReferenceManager = serviceReferenceManager;
    this.#snapshots = [];
  }

  public restore(): void {
    const snapshot: Snapshot | undefined = this.#snapshots.pop();

    if (snapshot === undefined) {
      throw new InversifyContainerError(
        InversifyContainerErrorKind.invalidOperation,
        'No snapshot available to restore',
      );
    }

    this.#serviceReferenceManager.reset(
      snapshot.activationService,
      snapshot.bindingService,
      snapshot.deactivationService,
    );
  }

  public snapshot(): void {
    this.#snapshots.push({
      activationService:
        this.#serviceReferenceManager.activationService.clone(),
      bindingService: this.#serviceReferenceManager.bindingService.clone(),
      deactivationService:
        this.#serviceReferenceManager.deactivationService.clone(),
    });
  }
}
