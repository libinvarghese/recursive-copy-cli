import { RecursiveCopyCliModel, TransformFn } from '../cli.model';
import { requireTryAll } from './requireTryAll';
import { Stats } from 'fs';
import { Transform } from 'stream';
import highland from 'highland';

export function transformParamsToFunction(argv: RecursiveCopyCliModel): void {
  let _transform: TransformFn | undefined = undefined;

  if (argv.transformModule) {
    const _transformFnList = argv.transformModule.map(module => requireTryAll(module) as TransformFn);
    _transform = (src: string, dest: string, stats: Stats): Transform => {
      // pipeline declaration in highland is missing
      /* istanbul ignore next */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (highland as any).pipeline(
        ..._transformFnList.map(transformFn => {
          return transformFn(src, dest, stats);
        })
      );
    };
  }

  if (_transform) {
    argv.transform = _transform;
  }
}