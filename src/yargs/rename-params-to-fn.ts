import flow from 'lodash/fp/flow';
import type { RecursiveCopyCliModel, RenameFn } from '../cli-model';
import { requireTryAll } from './requireTryAll';

// eslint-disable-next-line complexity, @typescript-eslint/prefer-readonly-parameter-types
export function renameParamsToFunction(argv: RecursiveCopyCliModel): void {
  let rename: RenameFn | undefined = undefined;

  if (argv.renameModule) {
    const renameFnList = argv.renameModule.map(module => requireTryAll(module) as RenameFn);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    rename = (src: string): string => flow(renameFnList)(src);
  } else if (argv.renamePattern) {
    const [regexpStr, substitute] = argv.renamePattern;
    const regParts = /^\/(.*?)\/([gim]*)$/.exec(regexpStr);
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let regexp: RegExp;
    if (regParts) {
      // the parsed pattern had delimiters and modifiers. handle them.

      // if flags is "", use undefined as you cant pass "" to new RegExp
      const flags = regParts[2] || undefined;

      regexp = new RegExp(regParts[1], flags);
    } else {
      // we got pattern string without delimiters
      regexp = new RegExp(regexpStr);
    }
    rename = (src: string): string => src.replace(regexp, substitute);
  }

  if (rename) {
    argv.rename = rename;
  }
}
