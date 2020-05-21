import { expect } from 'chai';
import { camelCase } from 'lodash';
import { RecursiveCopyCliModel } from '../../cli.model';
// eslint-disable-next-line import/default
import yargs from '../setup';

// eslint-disable-next-line mocha/no-setup-in-describe
describe('value options', () => {
  const _cliOtherOptions: {
    [key: string]: {
      alias: string;
      value: string | number;
      invalidValue?: unknown;
    };
  } = {
    concurrency: {
      alias: 'c',
      value: 10,
      invalidValue: 'a',
    },
  };

  // eslint-disable-next-line mocha/no-setup-in-describe
  Object.keys(_cliOtherOptions).forEach(key => {
    context(`option ${key}`, () => {
      let _args: {
        [key: string]: string;
      };
      let _cmdArgs: string;

      before(() => {
        _args = {
          src: 'srcPath',
          dest: 'destPath',
        };
        _cmdArgs = `${_args.src} ${_args.dest}`;
      });

      it('should be undefined when not specified', done => {
        yargs.parse(`${_cmdArgs}`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: _args,
          }).to.be.argsSuccessfullyParsed();
          expect(argv).not.to.have.property(key);

          done();
        });
      });

      it('should have value when set', done => {
        yargs.parse(
          `${_cmdArgs} --${key} ${_cliOtherOptions[key].value}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: _args,
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[camelCase(key)]).to.be.equal(_cliOtherOptions[key].value);

            done();
          }
        );
      });

      it('should have value when set via alias', done => {
        yargs.parse(
          `${_cmdArgs} --${_cliOtherOptions[key].alias} ${_cliOtherOptions[key].value}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: _args,
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[camelCase(key)]).to.be.equal(_cliOtherOptions[key].value);

            done();
          }
        );
      });

      it(`should fail when no argument is passed with ${key}`, done => {
        yargs.parse(`${_cmdArgs} --${key}`, (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
          expect({ error, output }).to.be.errorOnArgsParsing();

          done();
        });
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      if (_cliOtherOptions[key].invalidValue) {
        it(`should fail when invalid argument is passed with ${key}`, done => {
          yargs.parse(
            `${_cmdArgs} --${key} ${_cliOtherOptions[key].invalidValue}`,
            (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
              expect({ error, output }).to.be.errorOnArgsParsing();

              done();
            }
          );
        });
      }
    });
  });
});
