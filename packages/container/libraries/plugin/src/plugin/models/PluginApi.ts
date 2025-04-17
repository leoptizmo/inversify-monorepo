export interface PluginApi<TContainer> {
  define(
    name: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    method: (this: TContainer, ...args: any[]) => unknown,
  ): void;
}
