import { expect } from 'chai';
import { camelCase } from 'lodash';
import yargs from '../setup';
import type { RecursiveCopyCliModel } from '../../cli.model';

// eslint-disable-next-line mocha/no-setup-in-describe
describe('value options', () => {
  const cliOtherOptions: Record<
    string,
    {
      alias: string;
      value: number | string;
      invalidValue?: unknown;
    }
  > = {
    concurrency: {
      alias: 'c',
      value: 10,
      invalidValue: 'a',
    },
  };

  // eslint-disable-next-line mocha/no-setup-in-describe
  Object.keys(cliOtherOptions).forEach(key => {
    context(`option ${key}`, () => {
      let args = {} as Record<string, string>;
      let cmdArgs = '';

      before(() => {
        args = {
          src: 'srcPath',
          dest: 'destPath',
        };
        cmdArgs = `${args.src} ${args.dest}`;
      });

      it('should be undefined when not specified', done => {
        yargs.parse(cmdArgs, (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: args,
          }).to.be.argsSuccessfullyParsed();
          expect(argv).not.to.have.property(key);

          done();
        });
      });

      it('should have value when set', done => {
        yargs.parse(
          `${cmdArgs} --${key} ${cliOtherOptions[key].value}`,
          (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: args,
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            expect((argv as any)[camelCase(key)]).to.be.equal(cliOtherOptions[key].value);

            done();
          }
        );
      });

      it('should have value when set via alias', done => {
        yargs.parse(
          `${cmdArgs} --${cliOtherOptions[key].alias} ${cliOtherOptions[key].value}`,
          (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: args,
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            expect((argv as any)[camelCase(key)]).to.be.equal(cliOtherOptions[key].value);

            done();
          }
        );
      });

      it(`should fail when no argument is passed with ${key}`, done => {
        yargs.parse(
          `${cmdArgs} --${key}`,
          (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
            expect({ error, output }).to.be.errorOnArgsParsing();

            done();
          }
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      if (cliOtherOptions[key].invalidValue !== undefined) {
        it(`should fail when invalid argument is passed with ${key}`, done => {
          yargs.parse(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${cmdArgs} --${key} ${cliOtherOptions[key].invalidValue}`,
            (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
              expect({ error, output }).to.be.errorOnArgsParsing();

              done();
            }
          );
        });
      }
    });
  });
});
