export function filterCoerce(filter: readonly string[]): (RegExp | string)[] | undefined {
  let filterList: (RegExp | string)[] | undefined = undefined;
  const globList = filter.map(glob => {
    const regParts = /^\/(.*?)\/([gim]*)$/.exec(glob);

    let regexp: RegExp | string = glob;
    if (regParts) {
      // the parsed pattern had delimiters and modifiers. handle them.

      // if flags is "", use undefined as you cant pass "" to new RegExp
      const flags = regParts[2] || undefined;

      regexp = new RegExp(regParts[1], flags);
    }

    return regexp;
  });

  if (globList.length !== 0) {
    filterList = globList;
  } else {
    throw new Error('Error: Invalid filter option');
  }

  return filterList;
}
