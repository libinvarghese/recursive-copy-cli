import { resolve, relative } from 'path';
import { createWriteStream, readFileSync } from 'fs';
import { Readable } from 'stream';
// eslint-disable-next-line node/no-unpublished-import
import { safeLoad } from 'js-yaml';

const ymlDepFile = resolve('.github/dependabotGithubActions/.github/workflows/dummy.yml');
const ymlDepContent = readFileSync(ymlDepFile, 'utf8');
const ymlDep = safeLoad(ymlDepContent);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dependencies = ((ymlDep as any).jobs.dummy.steps as any[])
  .map(step => step.uses)
  .reduce((list, dep: string) => {
    const _match = /.*\/(.*)@.*/.exec(dep);

    if (_match === null) {
      throw new Error(`Incorrect format for dependency - ${dep}`);
    }

    const _key = _match[1];
    list[_key] = dep;

    return list;
  }, {});

const destFile = resolve('.github/jsTemplates/utils/dependencies.ts');
console.log(`${ymlDepFile} -> ${destFile}`);
const destStream = createWriteStream(destFile);

const fileHeader = `// ==========================
//
// THIS IS A GENERATED FILE. Careful when modifying this file.
//
// Running js2yaml will overwrite ${relative('./', ymlDepFile)}
//
// ==========================

`;
Readable.from(fileHeader).pipe(destStream, {
  end: false,
});

const depContent = `export const DEPENDENCIES = ${JSON.stringify(dependencies, null, 2)};
`;

Readable.from(depContent).pipe(destStream);
