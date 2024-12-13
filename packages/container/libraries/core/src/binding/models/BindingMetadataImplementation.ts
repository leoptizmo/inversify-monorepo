import { ServiceIdentifier } from '@inversifyjs/common';

import { SingleInmutableLinkedListNode } from '../../common/models/SingleInmutableLinkedList';
import { MetadataName } from '../../metadata/models/MetadataName';
import { MetadataTag } from '../../metadata/models/MetadataTag';
import { BindingMetadata } from './BindingMetadata';

export interface InternalBindingMetadata {
  readonly name: MetadataName | undefined;
  readonly tags: Map<MetadataTag, unknown>;
  readonly serviceIdentifier: ServiceIdentifier;
}

export class BindingMetadataImplementation implements BindingMetadata {
  readonly #node: SingleInmutableLinkedListNode<InternalBindingMetadata>;

  constructor(node: SingleInmutableLinkedListNode<InternalBindingMetadata>) {
    this.#node = node;
  }

  public get name(): MetadataName | undefined {
    return this.#node.elem.name;
  }

  public get tags(): Map<MetadataTag, unknown> {
    return this.#node.elem.tags;
  }

  public get serviceIdentifier(): ServiceIdentifier {
    return this.#node.elem.serviceIdentifier;
  }

  public getAncestor(): BindingMetadata | undefined {
    if (this.#node.previous === undefined) {
      return undefined;
    }

    return new BindingMetadataImplementation(this.#node.previous);
  }
}
