import { promises } from 'fs';
import { get, set } from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const packageJSON = require('../package.json');

function deleteUnwantedKeys(): void {
  const _keysToDelete = ['devDependencies', 'scripts', 'husky'];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  _keysToDelete.forEach(key => delete packageJSON[key]);
}

function renameDistPath(): void {
  const _pathsToFix = ['main', 'bin.recursive-copy'];

  _pathsToFix.forEach(path => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let _value: string = get(packageJSON, path);
    _value = _value.replace('dist/', '');
    set(packageJSON, path, _value);
  });
}

void (async (): Promise<void> => {
  deleteUnwantedKeys();
  renameDistPath();

  await promises.writeFile('dist/package.json', JSON.stringify(packageJSON, null, 2));
})();
