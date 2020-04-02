import { RecursiveCopyCliModel } from '../cli-model';
import { requireTryAll } from './requireTryAll';

export function renameParamsToFunction(argv: RecursiveCopyCliModel): void {
  let rename: ((filePath: string) => string) | undefined = undefined;

  if (argv.renameModule) {
    rename = requireTryAll(argv.renameModule);
  } else if (argv.renamePattern) {
    rename = (src: string): string => src.replace(argv.renamePattern as string, argv.renameSubstitute as string);
  } else if (argv.renameRegexp) {
    const regParts = /^\/(.*?)\/([gim]*)$/.exec(argv.renameRegexp);
    let regexp: RegExp;
    if (regParts) {
      // the parsed pattern had delimiters and modifiers. handle them.
      regexp = new RegExp(regParts[1], regParts[2]);
    } else {
      // we got pattern string without delimiters
      regexp = new RegExp(argv.renameRegexp);
    }
    rename = (src: string): string => src.replace(regexp, argv.renameSubstitute as string);
  }

  if (rename) {
    argv.rename = rename;
  }
}
