import { promises } from 'fs';
// eslint-disable-next-line you-dont-need-lodash-underscore/get
import { get, set } from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const packageJSON = require('../package.json');

function deleteUnwantedKeys(): void {
  const keysToDelete = ['devDependencies', 'scripts', 'husky'];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-dynamic-delete
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
  const indent = 2;

  deleteUnwantedKeys();
  renameDistPath();

  await promises.writeFile('dist/package.json', JSON.stringify(packageJSON, null, indent));
})();
