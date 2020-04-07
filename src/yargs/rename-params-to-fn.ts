import { RecursiveCopyCliModel } from '../cli-model';
import { requireTryAll } from './requireTryAll';
import flow from 'lodash/fp/flow';

export function renameParamsToFunction(argv: RecursiveCopyCliModel): void {
  let rename: ((filePath: string) => string) | undefined = undefined;

  if (argv.renameModule) {
    const renameFnList = argv.renameModule.map(module => requireTryAll(module) as (filePath: string) => string);
    rename = (src: string): string => flow(renameFnList)(src);
  } else if (argv.renamePattern) {
    const [regexpStr, substitute] = argv.renamePattern;
    const regParts = /^\/(.*?)\/([gim]*)$/.exec(regexpStr);
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
