import { expect } from 'chai';
// eslint-disable-next-line import/default
import { getYargsInstance } from '../setup';
import type { RecursiveCopyCliModel } from '../../cli-model';

// TODO: Waiting for https://github.com/yargs/yargs/issues/1952
// eslint-disable-next-line mocha/no-skipped-tests
describe('exclusive options', () => {
  const cliExclusiveOptions: readonly Readonly<Record<string, string[]>>[] = [
    {
      renamePattern: ['a', 'b'],
      renameModule: ['a', 'b'],
    },
  ];

  // eslint-disable-next-line mocha/no-setup-in-describe
  cliExclusiveOptions.forEach(option => {
    // eslint-disable-next-line mocha/no-setup-in-describe
    context(Object.keys(option).toString(), () => {
      // eslint-disable-next-line mocha/no-setup-in-describe
      let optStr = '';
      let args = {} as Record<string, string>;
      let cmdArgs = '';

      before(() => {
        args = {
          src: 'srcPath',
          dest: 'destPath',
        };
        cmdArgs = `${args.src} ${args.dest}`;

        optStr = Object.keys(option)
          .map(key => `--${key} ${option[key].join(' ')}`)
          .join(' ');
      });

      it('should fail when exclusive options are used', done => {
        // eslint-disable-next-line node/no-sync
        getYargsInstance().parseSync(
          `${cmdArgs} ${optStr}`,
          (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
            expect({ error, output }).to.be.errorOnArgsParsing();

            done();
          }
        );
      });
    });
  });
});
