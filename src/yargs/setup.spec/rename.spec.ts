import { expect } from 'chai';

// eslint-disable-next-line import/default
import yargs from '../setup';
import { RecursiveCopyCliModel } from '../../cli-model';
import { usageRegexp } from './constants';

describe('rename option', () => {
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
      expect(error).to.not.exist;
      expect(output).to.empty;
      expect(argv).to.include(args);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(argv).to.not.have.property('rename');

      done();
    });
  });

  context('with module', () => {
    it('should create a function when rename module is provided', done => {
      yargs.parse(
        `${cmdArgs} --rename-module pascalcase`,
        (_error: Error, argv: RecursiveCopyCliModel, _output: unknown) => {
          expect(argv.rename).to.be.a('function');

          const renameFn = argv.rename as (filePath: string) => string;
          expect(renameFn('foo bar baz')).to.be.equal('FooBarBaz');

          done();
        }
      );
    });

    it('should create a function when multiple rename modules are provided', done => {
      yargs.parse(
        `${cmdArgs} --rename-module pascalcase ./src/yargs/setup.spec/toupper.rename.module.mock.ts`,
        (_error: Error, argv: RecursiveCopyCliModel, _output: unknown) => {
          expect(argv.rename).to.be.a('function');

          const renameFn = argv.rename as (filePath: string) => string;
          expect(renameFn('foo bar baz')).to.be.equal('FOOBARBAZ');

          done();
        }
      );
    });

    it('should fail when rename module is invalid', done => {
      yargs.parse(
        `${cmdArgs} --rename-module nonExistantModule`,
        (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
          expect(error).to.exist;
          expect(output).to.match(usageRegexp);

          done();
        }
      );
    });
  });

  context('with pattern', () => {
    it('should create a function when rename pattern string is provided', done => {
      yargs.parse(`${cmdArgs} --rename-pattern a A`, (_error: Error, argv: RecursiveCopyCliModel, _output: unknown) => {
        expect(argv.rename).to.be.a('function');

        const renameFn = argv.rename as (filePath: string) => string;
        expect(renameFn('abca')).to.be.equal('Abca');

        done();
      });
    });

    it('should create a function when rename pattern regex is provided', done => {
      yargs.parse(
        `${cmdArgs} --rename-pattern /a/g A`,
        (_error: Error, argv: RecursiveCopyCliModel, _output: unknown) => {
          expect(argv.rename).to.be.a('function');

          const renameFn = argv.rename as (filePath: string) => string;
          expect(renameFn('abca')).to.be.equal('AbcA');

          done();
        }
      );
    });

    it('should create a function when rename pattern regex with group capture is provided', done => {
      yargs.parse(
        `${cmdArgs} --rename-pattern /(.*)-(.*)\\.(.*)/g $2-$1.$3`,
        (_error: Error, argv: RecursiveCopyCliModel, _output: unknown) => {
          expect(argv.rename).to.be.a('function');

          const renameFn = argv.rename as (filePath: string) => string;
          expect(renameFn('author-title.mp3')).to.be.equal('title-author.mp3');

          done();
        }
      );
    });
  });
});
