import process from 'process';
import console from 'console';
import { promisify } from 'util';
import { createWriteStream, promises } from 'fs';
import { Readable } from 'stream';
import { resolve, relative } from 'path';
// eslint-disable-next-line node/no-unpublished-import
import glob from 'glob';
// eslint-disable-next-line node/no-unpublished-import
import { dump } from 'js-yaml';
// eslint-disable-next-line node/no-unpublished-import
import { Promise as Bluebird } from 'bluebird';

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

void (async (): Promise<void> => {
  const jsFiles = await globP(pattern, {
    root: src,
    dot: true,
  });

  await Bluebird.each(jsFiles, async file => {
    const absPath = resolve(file);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, node/global-require
    const config: { disable?: boolean } = require(absPath);
    const destFile = absPath.replace(src, dest).replace('.yml.ts', '.yml');

    if (config.disable === true) {
      console.log(`rm ${destFile}`);
      await promises.unlink(destFile).catch((err: Readonly<NodeJS.ErrnoException>) => {
        if (err.code !== 'ENOENT') {
          throw err as Error;
        }
      });
    } else {
      console.log(`${file} -> ${destFile}`);
      const destStream = createWriteStream(destFile);

      const fileHeader = `# ==========================
#
# THIS IS A GENERATED FILE. Don't modify this file.
#
# Modify file in ${relative('./', file)}
#
# ==========================

`;
      Readable.from(fileHeader).pipe(destStream, {
        end: false,
      });

      const yaml = dump(config, {
        noRefs: true,
        lineWidth: 120,
      });
      Readable.from(yaml).pipe(destStream);
    }
  });
})();
