import { Pipe } from '../pipe/model/Pipe';

export function isPipe(value: unknown): value is Pipe {
  const pipe: Pipe = value as Pipe;

  return (
    value !== undefined &&
    typeof pipe === 'object' &&
    typeof pipe.execute === 'function'
  );
}
