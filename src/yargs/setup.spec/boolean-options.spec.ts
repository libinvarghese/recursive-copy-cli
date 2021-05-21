import { camelCase } from 'lodash';
import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import type { RecursiveCopyCliModel } from '../../cli.model';

describe('boolean options', () => {
  const cliBooleanOptions: Record<string, string> = {
    overwrite: 'w',
    expand: 'e',
    dot: 'd',
    junk: 'j',
    debug: 'v',
  };

  // eslint-disable-next-line mocha/no-setup-in-describe
  Object.keys(cliBooleanOptions).forEach(key => {
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
        yargs.parse(`${cmdArgs}`, (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
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

      it('should be true when set', done => {
        yargs.parse(
          `${cmdArgs} --${key}`,
          (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: args,
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unused-expressions
            expect((argv as any)[camelCase(key)]).to.be.true;

            done();
          }
        );
      });

      it('should be true when set via alias', done => {
        yargs.parse(
          `${cmdArgs} -${cliBooleanOptions[key]}`,
          (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: args,
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unused-expressions
            expect((argv as any)[camelCase(key)]).to.be.true;

            done();
          }
        );
      });
    });
  });
});
