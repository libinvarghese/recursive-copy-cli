import { promisify } from 'util';
import path from 'path';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
// eslint-disable-next-line node/no-unpublished-import
import glob from 'glob';
// eslint-disable-next-line node/no-unpublished-import
import { safeDump } from 'js-yaml';

// Converts a JS config (module.export) from src to YML config to dest
//
// Usage: npx ts-node scripts/js2yaml.ts '/pattern' src dest
//
// pattern   if glob must be in quotes, starting with '/', pattern is relative to src
//
// eg:
// `npx ts-node scripts/js2yaml.ts '/**/*.yml.ts' .github/jsTemplates .github`

const pattern = process.argv[2];
const src = process.argv[3];
const dest = process.argv[4];
const globP = promisify(glob);

(async (): Promise<void> => {
  const jsFiles = await globP(pattern, {
    root: src,
  });

  // npx ts-node scripts/get-config.ts ../.github/jsTemplates/workflows/test.yml.ts | yaml json --indent 2 --smart-string - | tee hello.yml
  jsFiles.forEach(file => {
    const absPath = path.resolve(file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require
    const config = require(absPath);

    const destFile = absPath.replace(src, dest).replace('.yml.ts', '.yml');
    console.log(`${file} -> ${destFile}`);
    const destStream = createWriteStream(destFile);

    const fileHeader = `# ==========================
#
# THIS IS A GENERATED FILE. Don't modify this file.
#
# Modify file in ${path.relative('./', file)}
#
# ==========================

`;
    Readable.from(fileHeader).pipe(destStream, {
      end: false,
    });

    const yaml = safeDump(config, {
      noRefs: true,
      lineWidth: 120,
    });
    Readable.from(yaml).pipe(destStream);
  });
})();
