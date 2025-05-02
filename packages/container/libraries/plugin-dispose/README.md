[![Test coverage](https://codecov.io/gh/inversify/monorepo/branch/main/graph/badge.svg?flag=%40inversifyjs%2Fplugin-dispose)](https://codecov.io/gh/inversify/monorepo/branch/main/graph/badge.svg?flag=%40inversifyjs%2Fplugin-dispose)
[![npm version](https://img.shields.io/github/package-json/v/inversify/monorepo?filename=packages%2Fcontainer%2Flibraries%2Fplugin-dispose%2Fpackage.json&style=plastic)](https://www.npmjs.com/package/@inversifyjs/plugin-dispose)

# @inversifyjs/plugin-dispose

InversifyJS plugin to enable proper disposal of singleton-scoped services when a container is no longer needed.

## Installation

```bash
npm install @inversifyjs/plugin-dispose inversify
```

## Usage

### Registering the Plugin

To use the plugin, you need to register it with your InversifyJS container. The plugin adds support for the standard JavaScript `Symbol.dispose` and `Symbol.asyncDispose` interfaces to your container:

```typescript
import { Container } from 'inversify';
import { PluginDispose } from '@inversifyjs/plugin-dispose';

const container = new Container();

// Register the PluginDispose plugin
container.register(PluginDispose);
```

### Disposing Singleton Services

Once registered, the plugin automatically tracks all singleton-scoped bindings in your container. When it's time to clean up resources, you can use either the synchronous or asynchronous disposal methods:

#### Synchronous Disposal

```typescript
// Synchronous disposal
container[Symbol.dispose]();
```

This will call any registered deactivation handlers for singleton-scoped services in the correct order, ensuring proper cleanup. All deactivation handlers must be synchronous when using this method.

#### Asynchronous Disposal

```typescript
// Asynchronous disposal
await container[Symbol.asyncDispose]();
```

This allows for asynchronous cleanup operations and will properly await all asynchronous deactivation handlers. You can also use the TypeScript `using` or `await using` statements for automatic disposal:

```typescript
// Using 'using' statement for automatic disposal
using container = new Container();
container.register(PluginDispose);
// Container will be disposed when exiting scope

// Using 'await using' for asynchronous disposal
await using asyncContainer = new Container();
asyncContainer.register(PluginDispose);
// Container will be asynchronously disposed when exiting scope
```

### Defining Deactivation Handlers

There are two ways to define deactivation handlers for your services:

#### Using the `onDeactivation` Method

```typescript
interface Database {
  connect(): void;
  disconnect(): Promise<void>;
}

class PostgresDatabase implements Database {
  // Implementation...

  async disconnect(): Promise<void> {
    // Cleanup logic
    console.log('Disconnecting from database');
  }
}

// Register with deactivation handler
container
  .bind<Database>('Database')
  .to(PostgresDatabase)
  .inSingletonScope()
  .onDeactivation(async (instance) => {
    await instance.disconnect();
  });
```

#### Using the `@preDestroy` Decorator

```typescript
import { preDestroy, injectable } from 'inversify';

@injectable()
class LogService {
  private fileHandle: any;

  constructor() {
    this.fileHandle = { /* some resource */ };
  }

  @preDestroy()
  async cleanup(): Promise<void> {
    // Close file handles, etc.
    console.log('Cleaning up log service');
    this.fileHandle = null;
  }
}

container.bind(LogService).toSelf().inSingletonScope();
```

## How It Works

This plugin automatically:

1. Tracks all singleton-scoped bindings in your container
2. Manages the dependency graph to ensure services are disposed in the correct order
3. Provides standard disposal interfaces (`Symbol.dispose` and `Symbol.asyncDispose`)
4. Invokes any registered deactivation handlers when disposal is triggered

## Example

Here's a complete example showing how to use the plugin with services that need proper cleanup:

```typescript
import { Container, injectable, preDestroy } from 'inversify';
import { PluginDispose } from '@inversifyjs/plugin-dispose';

@injectable()
class DatabaseConnection {
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    console.log('Connecting to database');
    this.isConnected = true;
  }

  @preDestroy()
  disconnect(): void {
    if (this.isConnected) {
      console.log('Disconnecting from database');
      this.isConnected = false;
    }
  }
}

@injectable()
class UserRepository {
  constructor(private dbConnection: DatabaseConnection) {}
  
  @preDestroy()
  cleanup(): void {
    console.log('Cleaning up user repository');
  }
}

function buildContainer(): Container {
  // Create and configure container
  const container = new Container();
  container.register(PluginDispose);

  return container;
}

await using container = buildContainer()

// Register services
container.bind(DatabaseConnection).toSelf().inSingletonScope();
container.bind(UserRepository).toSelf().inSingletonScope();

// Use the services
const userRepo = container.get(UserRepository);

// Output:
// Cleaning up user repository
// Disconnecting from database
```
