import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';

import { RecursiveCopyCliModel } from '../../cli.model';
import { camelCase } from 'lodash';

describe('boolean options', () => {
  const _cliBooleanOptions: {
    [key: string]: string;
  } = {
    overwrite: 'w',
    expand: 'e',
    dot: 'd',
    junk: 'j',
    debug: 'v'
  };

  // eslint-disable-next-line mocha/no-setup-in-describe
  Object.keys(_cliBooleanOptions).forEach(key => {
    context(`option ${key}`, () => {
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
      });

      it('should be undefined when not specified', done => {
        yargs.parse(`${_cmdArgs}`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: _args
          }).to.be.argsSuccessfullyParsed();
          expect(argv).to.not.have.property(key);

          done();
        });
      });

      it('should be true when set', done => {
        yargs.parse(`${_cmdArgs} --${key}`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: _args
          }).to.be.argsSuccessfullyParsed();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect((argv as any)[camelCase(key)]).to.be.true;

          done();
        });
      });

      it('should be true when set via alias', done => {
        yargs.parse(
          `${_cmdArgs} -${_cliBooleanOptions[key]}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: _args
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[camelCase(key)]).to.be.true;

            done();
          }
        );
      });
    });
  });
});
