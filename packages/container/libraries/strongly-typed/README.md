[![Test coverage](https://codecov.io/gh/inversify/monorepo/branch/main/graph/badge.svg?flag=%40inversifyjs%2Fstrongly-typed)](https://codecov.io/gh/inversify/monorepo/branch/main/graph/badge.svg?flag=%40inversifyjs%2Fstrongly-typed)
[![npm version](https://img.shields.io/github/package-json/v/inversify/monorepo?filename=packages%2Fcontainer%2Flibraries%2Fstrongly-typed%2Fpackage.json&style=plastic)](https://www.npmjs.com/package/@inversifyjs/strongly-typed)

# @inversifyjs/strongly-typed

Type definitions for adding strong typing to the `Container` and `@inject()` decorator.


## Getting started

This library can be used in a couple of ways, depending on your preference.

All usages wind up with you having a strongly-typed `TypedContainer`, which is a generic class that accepts a binding map as a type argument, which forms the contract that your container will adhere to:

```ts
import { TypedContainer } from '@inversifyjs/strongly-typed';

interface Foo { foo: string }
interface Bar { bar: string }

interface BindingMap {
  foo: Foo;
  bar: Bar;
}

const container = new TypedContainer<BindingMap>();

// Bindings are now strongly typed:

container.bind('foo').toConstantValue({foo: 'abc'}); // ok
container.rebind('foo').toConstantValue({unknown: 'uh-oh'}) // compilation error

let foo: Foo = container.get('foo') // ok
foo = container.get('bar') // compilation error
foo = container.get('unknown-identifier') // compilation error
```

### Instantiation

The simplest way to use the library is to directly construct a `TypedContainer`:

```ts
import { TypedContainer } from '@inversifyjs/strongly-typed';

const container = new TypedContainer<BindingMap>();
```

This class is actually just a re-typed re-export of the vanilla `Container`, so shares all underlying functionality.

### Type assertion

If you'd prefer to keep this library out of your final dependency tree, you can just import the types and perform a type assertion:

```ts
import { Container } from 'inversify';
// The type import will be stripped during transpilation
import type { TypedContainer } from '@inversifyjs/strongly-typed';

const container = new Container() as TypedContainer<BindingMap>;
```


## Injection

The library also exposes a `TypedInject` type that will leverage the `BindingMap` you've used to strongly type your `Container`.

You'll need to re-export the `inject` decorator with a type assertion:

```ts
import { inject, multiInject } from 'inversify';
import type { TypedInject, TypedMultiInject } from '@inversifyjs/strongly-typed';

export const $inject = inject as TypedInject<BindingMap>;
export const $multiInject = multiInject as TypedMultiInject<BindingMap>;
```

You can now use this to strongly type injected constructor parameters, or **public** properties:

```ts
@injectable()
class B {
  public constructor(
    @$inject('foo') // ok
    foo: Foo,

    @$inject('foo') // compilation error
    bar: Bar,
  ) {}
}

@injectable()
class A {
  @$inject('foo') // ok
  public foo: Foo;

  @$inject('foo') // compilation error
  public bar: Bar;
}
```


## Advanced usage

### `Promise` bindings

`inversify` allows binding `Promise`s, but these **must** be retrieved using `getAsync()` trying to resolve them using `get()` will throw.

The type signatures will help to enforce this if you show an async binding in the binding map with a `Promise`:

```ts
interface BindingMap {
  number: number;
  asyncNumber: Promise<number>;
}

const container = new TypedContainer<BindingMap>();

container.get('number') // number
container.get('asyncNumber') // compiler error
container.getAsync('asyncNumber') // Promise<number>
```

### Container hierarchies

If setting a `parent`, types will need to be manually merged:

```ts
type ParentMap  = {...};
type ChildMap = {...};

const child = new TypedContainer<ParentMap & ChildMap>({
  parent,
});
```


## Known issues / limitations

### Strongly-typing `private` properties

Note that because the decorator types can't "see" `private` properties, we can't strongly type them:

```ts
@injectable()
class A {
  @$inject('foo')
  private foo: Foo; // fails :'(
}
```

Work around this by either:

  1. Making the property `public` (and perhaps prefixing it with an underscore to remind consumers it should be private)
  2. Using the weakly-typed `@inject()` directly from `'inversify'`


### Confusing compiler errors for constructor injection

There's no custom compiler errors for TypeScript, so we can't signal particularly usefully that a constructor parameter is wrong, apart from the fact that the compilation fails.

The error will look something like:

```
Unable to resolve signature of parameter decorator when called as an expression.
  Argument of type '2' is not assignable to parameter of type 'undefined'. (ts1239)
```

This actually means something like this:

> The injected constructor parameter at index `2` is of the wrong type.
