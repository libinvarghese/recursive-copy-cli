import type { Stats } from 'fs';
import type { Transform } from 'stream';
import highland from 'highland';
import type { RecursiveCopyCliModel, TransformFn } from '../cli.model';
import { requireTryAll } from './requireTryAll';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export function transformParamsToFunction(argv: RecursiveCopyCliModel): void {
  let transform: TransformFn | undefined = undefined;

  if (argv.transformModule) {
    const transformFnList = argv.transformModule.map(module => requireTryAll(module) as TransformFn);
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    transform = (src: string, dest: string, stats: Stats): Transform => {
      // pipeline declaration in highland is missing
      /* istanbul ignore next */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
