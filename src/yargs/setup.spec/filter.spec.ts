import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import { RecursiveCopyCliModel } from '../../cli.model';

describe('filter option', () => {
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
      expect(argv).not.to.have.property('filter');

      done();
    });
  });

  it('should create an array filter globs when strings are provided', done => {
    // > recursive-copy srcPath destPath --filter "*.js" "*.json"
    yargs.parse(
      `${_cmdArgs} --filter "*.js" "*.json"`,
      (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: _args
        }).to.be.argsSuccessfullyParsed();
        expect(argv.filter).to.be.array();
        expect(argv.filter).to.be.deep.equal(['*.js', '*.json']);

        done();
      }
    );
  });

  it('should create an array of filter globs when regexp are provided', done => {
    // > recursive-copy srcPath destPath --filter "/\\.ts$/"
    yargs.parse(`${_cmdArgs} --filter "/\\.ts$/"`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
      expect({
        error,
        argv,
        output,
        args: _args
      }).to.be.argsSuccessfullyParsed();
      expect(argv.filter).to.be.array();
      expect(argv.filter).to.be.deep.equal([/\.ts$/]);

      done();
    });
  });

  it('should create an array of filter globs when both regexp & string are provided', done => {
    yargs.parse(
      // > recursive-copy srcPath destPath --filter "/\\.ts$/" "*.js"
      `${_cmdArgs} --filter "/\\.ts$/" "*.js"`,
      (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: _args
        }).to.be.argsSuccessfullyParsed();
        expect(argv.filter).to.be.array();
        expect(argv.filter).to.be.deep.equal([/\.ts$/, '*.js']);

        done();
      }
    );
  });

  it('should fail when invalid regexp are provided', done => {
    // > recursive-copy srcPath destPath --filter "/*.ts/" # ERROR
    yargs.parse(`${_cmdArgs} --filter "/*.ts/"`, (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
      expect({ error, output }).to.be.errorOnArgsParsing();

      done();
    });
  });
});
