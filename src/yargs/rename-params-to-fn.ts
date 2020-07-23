import flow from 'lodash/fp/flow';
import { RecursiveCopyCliModel, RenameFn } from '../cli.model';
import { requireTryAll } from './requireTryAll';

export function renameParamsToFunction(argv: RecursiveCopyCliModel): void {
  let _rename: RenameFn | undefined = undefined;

  if (argv.renameModule) {
    const _renameFnList = argv.renameModule.map(module => requireTryAll(module) as RenameFn);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    _rename = (src: string): string => flow(_renameFnList)(src);
  } else if (argv.renamePattern) {
    const [_regexpStr, _substitute] = argv.renamePattern;
    const _regParts = /^\/(.*?)\/([gim]*)$/.exec(_regexpStr);
    let _regexp: RegExp;
    if (_regParts) {
      // the parsed pattern had delimiters and modifiers. handle them.

      // if flags is "", use undefined as you cant pass "" to new RegExp
      const _flags = _regParts[2] || undefined;

      _regexp = new RegExp(_regParts[1], _flags);
    } else {
      // we got pattern string without delimiters
      _regexp = new RegExp(_regexpStr);
    }
    _rename = (src: string): string => src.replace(_regexp, _substitute);
  }

  if (_rename) {
    argv.rename = _rename;
  }
}
