import { RecursiveCopyCliModel, TransformFn } from '../cli-model';
import { requireTryAll } from './requireTryAll';
import { Stats } from 'fs';
import { Transform } from 'stream';
import highland from 'highland';

export function transformParamsToFunction(argv: RecursiveCopyCliModel): void {
  let transform: TransformFn | undefined = undefined;

  if (argv.transformModule) {
    const transformFnList = argv.transformModule.map(module => (requireTryAll(module) as unknown) as TransformFn);
    transform = (src: string, dest: string, stats: Stats): Transform => {
      // pipeline declaration in highland is missing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (highland as any).pipeline(
        ...transformFnList.map(transformFn => {
          return transformFn(src, dest, stats);
        })
      );
    };
  }

  if (transform) {
    argv.transform = transform;
  }
}
