import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';

import { RecursiveCopyCliModel } from '../../cli-model';
import { usageRegexp } from './constants';

describe('exclusive options', () => {
  const cliExclusiveOptions: {
    [key: string]: string[];
  }[] = [
    {
      'rename-pattern': ['a', 'b'],
      'rename-module': ['a', 'b']
    }
  ];

  // eslint-disable-next-line mocha/no-setup-in-describe
  cliExclusiveOptions.forEach(option => {
    // eslint-disable-next-line mocha/no-setup-in-describe
    context(Object.keys(option).toString(), () => {
      // eslint-disable-next-line mocha/no-setup-in-describe
      let optStr = '';
      let args: {
        [key: string]: string;
      };
      let cmdArgs: string;

      before(() => {
        args = {
          src: 'srcPath',
          dest: 'destPath'
        };
        cmdArgs = `${args.src} ${args.dest}`;

        optStr = Object.keys(option)
          .map(key => `--${key} ${option[key].join(' ')}`)
          .join(' ');
      });

      it('should fail when exclusive options are used', done => {
        yargs.parse(`${cmdArgs} ${optStr}`, (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
          expect(error).to.exist;
          expect(output).to.match(usageRegexp);

          done();
        });
      });
    });
  });
});
