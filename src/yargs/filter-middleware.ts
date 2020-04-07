import { RecursiveCopyCliModel } from '../cli-model';

export function filterMiddleware(argv: RecursiveCopyCliModel): void {
  let filterList: (string | RegExp)[] = [];

  if (argv.filter) {
    const globList = argv.filter.map(glob => {
      const regexpStr = glob as string;
      const regParts = /^\/(.*?)\/([gim]*)$/.exec(regexpStr);

      let regexp: RegExp | string = regexpStr;
      if (regParts) {
        // the parsed pattern had delimiters and modifiers. handle them.

        // if flags is "", use undefined as you cant pass "" to new RegExp
        const flags = regParts[2] || undefined;

        regexp = new RegExp(regParts[1], flags);
      }

      return regexp;
    });

    filterList = [...globList];
  }

  if (filterList.length !== 0) {
    argv.filter = filterList;
  }
}
