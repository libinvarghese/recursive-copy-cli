import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import { RecursiveCopyCliModel } from '../../cli-model';

describe('filter option', () => {
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
      expect(argv).to.not.have.property('filter');

      done();
    });
  });

  it('should create an array filter globs when strings are provided', done => {
    yargs.parse(`${cmdArgs} --filter "*.js" "*.json"`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
      expect({ error, argv, output, args }).to.be.argsSuccessfullyParsed();
      expect(argv.filter).to.be.array();
      expect(argv.filter).to.be.deep.equal(['*.js', '*.json']);

      done();
    });
  });

  it('should create an array of filter globs when regexp are provided', done => {
    yargs.parse(`${cmdArgs} --filter "/\\.ts$/"`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
      expect({ error, argv, output, args }).to.be.argsSuccessfullyParsed();
      expect(argv.filter).to.be.array();
      expect(argv.filter).to.be.deep.equal([/\.ts$/]);

      done();
    });
  });

  it('should create an array of filter globs when both regexp & string are provided', done => {
    yargs.parse(
      `${cmdArgs} --filter "/\\.ts$/" "*.js"`,
      (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
        expect({ error, argv, output, args }).to.be.argsSuccessfullyParsed();
        expect(argv.filter).to.be.array();
        expect(argv.filter).to.be.deep.equal([/\.ts$/, '*.js']);

        done();
      }
    );
  });

  it('should fail when invalid regexp are provided', done => {
    yargs.parse(`${cmdArgs} --filter "/*.ts/"`, (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
      expect({ error, output }).to.be.errorOnArgsParsing();

      done();
    });
  });
});
