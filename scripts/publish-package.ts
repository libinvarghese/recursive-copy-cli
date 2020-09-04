import { promises } from 'fs';
import { get, set } from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const packageJSON = require('../package.json');

function deleteUnwantedKeys(): void {
  const keysToDelete = ['devDependencies', 'scripts', 'husky'];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  keysToDelete.forEach(key => delete packageJSON[key]);
}

function renameDistPath(): void {
  const pathsToFix = ['main', 'bin.recursive-copy'];

  pathsToFix.forEach(path => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let value: string = get(packageJSON, path);
    value = value.replace('dist/', '');
    set(packageJSON, path, value);
  });
}

void (async (): Promise<void> => {
  deleteUnwantedKeys();
  renameDistPath();

  await promises.writeFile('dist/package.json', JSON.stringify(packageJSON, null, 2));
})();
