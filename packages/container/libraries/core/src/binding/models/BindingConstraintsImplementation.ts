import { ServiceIdentifier } from '@inversifyjs/common';

import { SingleInmutableLinkedListNode } from '../../common/models/SingleInmutableLinkedList';
import { MetadataName } from '../../metadata/models/MetadataName';
import { MetadataTag } from '../../metadata/models/MetadataTag';
import { BindingConstraints } from './BindingConstraints';

export interface InternalBindingConstraints {
  readonly name: MetadataName | undefined;
  readonly tags: Map<MetadataTag, unknown>;
  readonly serviceIdentifier: ServiceIdentifier;
}

export class BindingConstraintsImplementation implements BindingConstraints {
  readonly #node: SingleInmutableLinkedListNode<InternalBindingConstraints>;

  constructor(node: SingleInmutableLinkedListNode<InternalBindingConstraints>) {
    this.#node = node;
  }

  public get name(): MetadataName | undefined {
    return this.#node.elem.name;
  }

  public get serviceIdentifier(): ServiceIdentifier {
    return this.#node.elem.serviceIdentifier;
  }

  public get tags(): Map<MetadataTag, unknown> {
    return this.#node.elem.tags;
  }

  public getAncestor(): BindingConstraints | undefined {
    if (this.#node.previous === undefined) {
      return undefined;
    }

    return new BindingConstraintsImplementation(this.#node.previous);
  }
}
