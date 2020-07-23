import { expect } from 'chai';
import { camelCase } from 'lodash';
import { RecursiveCopyCliModel } from '../../cli.model';
// eslint-disable-next-line import/default
import yargs from '../setup';

// eslint-disable-next-line mocha/no-setup-in-describe
describe('array options', () => {
  const _cliArrayOptions: {
    [key: string]: {
      alias: string;
      value: string[];
      args?: 2;
      mapKey?: string;
    };
  } = {
    'rename-pattern': {
      alias: 'p',
      args: 2,
      value: ['a', 'b'],
      mapKey: 'rename',
    },
    'rename-module': {
      alias: 'r',
      value: ['pascalcase', './src/mocks.spec/toupper.rename.module.mock.ts'],
      mapKey: 'rename',
    },
    'transform-module': {
      alias: 't',
      value: ['./src/mocks.spec/toupper.transform.module.mock.ts', './src/mocks.spec/eol.transform.module.mock.ts'],
      mapKey: 'transform',
    },
    filter: {
      alias: 'f',
      value: ['*.ts', '*.js'],
    },
  };

  // eslint-disable-next-line mocha/no-setup-in-describe
  Object.keys(_cliArrayOptions).forEach(key => {
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
          if (_cliArrayOptions[key].mapKey) {
            expect(argv).not.to.have.property(_cliArrayOptions[key].mapKey as string);
          }

          done();
        });
      });

      it('should have value when set', done => {
        yargs.parse(
          `${_cmdArgs} --${key} ${_cliArrayOptions[key].value.join(' ')}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: _args,
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            expect((argv as any)[camelCase(key)]).to.be.deep.equal(_cliArrayOptions[key].value);
            if (_cliArrayOptions[key].mapKey) {
              expect(argv).to.have.property(_cliArrayOptions[key].mapKey as string);
            }

            done();
          }
        );
      });

      it('should have value when set via alias', done => {
        yargs.parse(
          `${_cmdArgs} --${_cliArrayOptions[key].alias} ${_cliArrayOptions[key].value.join(' ')}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: _args,
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            expect((argv as any)[camelCase(key)]).to.be.deep.equal(_cliArrayOptions[key].value);
            if (_cliArrayOptions[key].mapKey) {
              expect(argv).to.have.property(_cliArrayOptions[key].mapKey as string);
            }

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
      if (_cliArrayOptions[key].args) {
        context('when argument count is defined', () => {
          it(`should fail when more than required argument is passed with ${key}`, done => {
            const _moreArgs = [..._cliArrayOptions[key].value, _cliArrayOptions[key].value[0]];
            yargs.parse(
              `${_cmdArgs} --${key} ${_moreArgs.join(' ')}`,
              (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
                expect({ error, output }).to.be.errorOnArgsParsing();

                done();
              }
            );
          });

          it('should fail when less than required argument is passed with concurrency', done => {
            const _moreArgs = [..._cliArrayOptions[key].value];
            _moreArgs.pop();
            yargs.parse(
              `${_cmdArgs} --${key} ${_moreArgs.join(' ')}`,
              (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
                expect({ error, output }).to.be.errorOnArgsParsing();

                done();
              }
            );
          });
        });
      }
    });
  });
});
