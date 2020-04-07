import { expect } from 'chai';
import { camelCase } from 'lodash';
import { RecursiveCopyCliModel } from '../../cli-model';
// eslint-disable-next-line import/default
import yargs from '../setup';

// eslint-disable-next-line mocha/no-setup-in-describe
describe('array options', () => {
  const cliArrayOptions: {
    [key: string]: { alias: string; value: string[]; args?: 2; mapKey?: string };
  } = {
    'rename-pattern': {
      alias: 'p',
      args: 2,
      value: ['a', 'b'],
      mapKey: 'rename'
    },
    'rename-module': {
      alias: 'r',
      value: ['pascalcase', './src/yargs/setup.spec/toupper.rename.module.mock.ts'],
      mapKey: 'rename'
    },
    'transform-module': {
      alias: 't',
      value: [
        './src/yargs/setup.spec/toupper.transform.module.mock.ts',
        './src/yargs/setup.spec/eol.transform.module.mock.ts'
      ],
      mapKey: 'transform'
    },
    filter: {
      alias: 'f',
      value: ['*.ts', '*.js']
    }
  };

  // eslint-disable-next-line mocha/no-setup-in-describe
  Object.keys(cliArrayOptions).forEach(key => {
    context(`option ${key}`, () => {
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
      });

      it('should be undefined when not specified', done => {
        yargs.parse(`${cmdArgs}`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect({ error, argv, output, args }).to.be.argsSuccessfullyParsed();
          expect(argv).to.not.have.property(key);
          if (cliArrayOptions[key].mapKey) {
            expect(argv).to.not.have.property(cliArrayOptions[key].mapKey as string);
          }

          done();
        });
      });

      it('should have value when set', done => {
        yargs.parse(
          `${cmdArgs} --${key} ${cliArrayOptions[key].value.join(' ')}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect({ error, argv, output, args }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[camelCase(key)]).to.be.deep.equal(cliArrayOptions[key].value);
            if (cliArrayOptions[key].mapKey) {
              expect(argv).to.have.property(cliArrayOptions[key].mapKey as string);
            }

            done();
          }
        );
      });

      it('should have value when set via alias', done => {
        yargs.parse(
          `${cmdArgs} --${cliArrayOptions[key].alias} ${cliArrayOptions[key].value.join(' ')}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect({ error, argv, output, args }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[camelCase(key)]).to.be.deep.equal(cliArrayOptions[key].value);
            if (cliArrayOptions[key].mapKey) {
              expect(argv).to.have.property(cliArrayOptions[key].mapKey as string);
            }

            done();
          }
        );
      });

      it(`should fail when no argument is passed with ${key}`, done => {
        yargs.parse(`${cmdArgs} --${key}`, (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
          expect({ error, output }).to.be.errorOnArgsParsing();

          done();
        });
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      if (cliArrayOptions[key].args) {
        context('when argument count is defined', () => {
          it(`should fail when more than required argument is passed with ${key}`, done => {
            const moreArgs = [...cliArrayOptions[key].value, cliArrayOptions[key].value[0]];
            yargs.parse(
              `${cmdArgs} --${key} ${moreArgs.join(' ')}`,
              (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
                expect({ error, output }).to.be.errorOnArgsParsing();

                done();
              }
            );
          });

          it('should fail when less than required argument is passed with concurrency', done => {
            const moreArgs = [...cliArrayOptions[key].value];
            moreArgs.pop();
            yargs.parse(
              `${cmdArgs} --${key} ${moreArgs.join(' ')}`,
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
