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

A strongly-typed child container can be created from a parent container.

This strong typing is optional for the child:

```ts
const parent = new TypedContainer<BindingMap>();
const child = parent.createChild(); // weakly typed
```

If the child is strongly-typed, its binding will automatically be adjusted to include the parent types:

```ts
const parent = new TypedContainer<{foo: Foo}>();
const child = parent.createChild<{bar: Bar}>();
child.get('bar') // ok
child.get('foo') // ok
```

A child may also override a parent's bindings with a completely unrelated type:

```ts
const parent = new TypedContainer<{foo: Foo}>();
const child = parent.createChild<{foo: Bar}>();
const resolved: Bar = child.get('foo');
```
