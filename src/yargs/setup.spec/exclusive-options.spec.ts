import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import { RecursiveCopyCliModel } from '../../cli.model';

describe('exclusive options', () => {
  const _cliExclusiveOptions: {
    [key: string]: string[];
  }[] = [
    {
      'rename-pattern': ['a', 'b'],
      'rename-module': ['a', 'b']
    }
  ];

  // eslint-disable-next-line mocha/no-setup-in-describe
  _cliExclusiveOptions.forEach(option => {
    // eslint-disable-next-line mocha/no-setup-in-describe
    context(Object.keys(option).toString(), () => {
      // eslint-disable-next-line mocha/no-setup-in-describe
      let _optStr = '';
      let _args: {
        [key: string]: string;
      };
      let _cmdArgs: string;

      before(() => {
        _args = {
          src: 'srcPath',
          dest: 'destPath'
        };
        _cmdArgs = `${_args.src} ${_args.dest}`;

        _optStr = Object.keys(option)
          .map(key => `--${key} ${option[key].join(' ')}`)
          .join(' ');
      });

      it('should fail when exclusive options are used', done => {
        yargs.parse(`${_cmdArgs} ${_optStr}`, (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
          expect({ error, output }).to.be.errorOnArgsParsing();

          done();
        });
      });
    });
  });
});
