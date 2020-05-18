export function filterCoerce(filter: string[]): (string | RegExp)[] | undefined {
  let _filterList: (string | RegExp)[] | undefined = undefined;
  if (filter) {
    const _globList = filter.map(glob => {
      const _regParts = /^\/(.*?)\/([gim]*)$/.exec(glob);

      let _regexp: RegExp | string = glob;
      if (_regParts) {
        // the parsed pattern had delimiters and modifiers. handle them.

        // if flags is "", use undefined as you cant pass "" to new RegExp
        const _flags = _regParts[2] || undefined;

        _regexp = new RegExp(_regParts[1], _flags);
      }

      return _regexp;
    });

    if (_globList.length !== 0) {
      _filterList = _globList;
    } else {
      throw new Error('Error: Invalid filter option');
    }
  }

  return _filterList;
}
