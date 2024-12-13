export interface SingleInmutableLinkedListNode<T> {
  elem: T;
  previous: SingleInmutableLinkedListNode<T> | undefined;
}

export class SingleInmutableLinkedList<T> implements Iterable<T> {
  constructor(public readonly last: SingleInmutableLinkedListNode<T>) {}

  public concat(elem: T): SingleInmutableLinkedList<T> {
    return new SingleInmutableLinkedList({
      elem,
      previous: this.last,
    });
  }

  public [Symbol.iterator](): Iterator<T> {
    let node: SingleInmutableLinkedListNode<T> | undefined = this.last;

    return {
      next: (): IteratorResult<T> => {
        if (node === undefined) {
          return {
            done: true,
            value: undefined,
          };
        }

        const elem: T = node.elem;
        node = node.previous;

        return {
          done: false,
          value: elem,
        };
      },
    };
  }
}
