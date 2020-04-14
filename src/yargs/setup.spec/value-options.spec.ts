import { expect } from 'chai';
import { camelCase } from 'lodash';
import { RecursiveCopyCliModel } from '../../cli.model';
// eslint-disable-next-line import/default
import yargs from '../setup';

// eslint-disable-next-line mocha/no-setup-in-describe
describe('value options', () => {
  const cliOtherOptions: {
    [key: string]: { alias: string; value: string | number; invalidValue?: unknown };
  } = {
    concurrency: {
      alias: 'c',
      value: 10,
      invalidValue: 'a'
    }
  };

  // eslint-disable-next-line mocha/no-setup-in-describe
  Object.keys(cliOtherOptions).forEach(key => {
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

          done();
        });
      });

      it('should have value when set', done => {
        yargs.parse(
          `${cmdArgs} --${key} ${cliOtherOptions[key].value}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect({ error, argv, output, args }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[camelCase(key)]).to.be.equal(cliOtherOptions[key].value);

            done();
          }
        );
      });

      it('should have value when set via alias', done => {
        yargs.parse(
          `${cmdArgs} --${cliOtherOptions[key].alias} ${cliOtherOptions[key].value}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect({ error, argv, output, args }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[camelCase(key)]).to.be.equal(cliOtherOptions[key].value);

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
      if (cliOtherOptions[key].invalidValue) {
        it(`should fail when invalid argument is passed with ${key}`, done => {
          yargs.parse(
            `${cmdArgs} --${key} ${cliOtherOptions[key].invalidValue}`,
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
