import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import type { RecursiveCopyCliModel } from '../../cli.model';

describe('filter option', () => {
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
      expect(argv).not.to.have.property('filter');

      done();
    });
  });

  it('should create an array filter globs when strings are provided', done => {
    // > recursive-copy srcPath destPath --filter "*.js" "*.json"
    yargs.parse(
      `${cmdArgs} --filter "*.js" "*.json"`,
      (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: args,
        }).to.be.argsSuccessfullyParsed();
        expect(argv.filter).to.be.array();
        expect(argv.filter).to.be.deep.equal(['*.js', '*.json']);

        done();
      }
    );
  });

  it('should create an array of filter globs when regexp are provided', done => {
    // > recursive-copy srcPath destPath --filter "/\\.ts$/"
    yargs.parse(
      `${cmdArgs} --filter "/\\.ts$/"`,
      (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: args,
        }).to.be.argsSuccessfullyParsed();
        expect(argv.filter).to.be.array();
        expect(argv.filter).to.be.deep.equal([/\.ts$/]);

        done();
      }
    );
  });

  it('should create an array of filter globs when both regexp & string are provided', done => {
    yargs.parse(
      // > recursive-copy srcPath destPath --filter "/\\.ts$/" "*.js"
      `${cmdArgs} --filter "/\\.ts$/" "*.js"`,
      (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: args,
        }).to.be.argsSuccessfullyParsed();
        expect(argv.filter).to.be.array();
        expect(argv.filter).to.be.deep.equal([/\.ts$/, '*.js']);

        done();
      }
    );
  });

  it('should fail when invalid regexp are provided', done => {
    // > recursive-copy srcPath destPath --filter "/*.ts/" # ERROR
    yargs.parse(
      `${cmdArgs} --filter "/*.ts/"`,
      (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect({ error, output }).to.be.errorOnArgsParsing();

        done();
      }
    );
  });
});
