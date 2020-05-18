import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import { RecursiveCopyCliModel, RenameFn } from '../../cli.model';

describe('rename option', () => {
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
      expect(argv).to.not.have.property('rename');

      done();
    });
  });

  context('with module', () => {
    it('should create a function when rename module is provided', done => {
      // > recursive-copy srcPath destPath --rename-module pascalcase
      yargs.parse(
        `${_cmdArgs} --rename-module pascalcase`,
        (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: _args
          }).to.be.argsSuccessfullyParsed();
          expect(argv.rename).to.be.a('function');

          const _renameFn = argv.rename as RenameFn;
          expect(_renameFn('foo bar baz')).to.be.equal('FooBarBaz');

          done();
        }
      );
    });

    it('should create a function when multiple rename modules are provided', done => {
      // > recursive-copy srcPath destPath --rename-module pascalcase ./src/mocks.spec/toupper.rename.module.mock.ts
      yargs.parse(
        `${_cmdArgs} --rename-module pascalcase ./src/mocks.spec/toupper.rename.module.mock.ts`,
        (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: _args
          }).to.be.argsSuccessfullyParsed();
          expect(argv.rename).to.be.a('function');

          const _renameFn = argv.rename as RenameFn;
          expect(_renameFn('foo bar baz')).to.be.equal('FOOBARBAZ');

          done();
        }
      );
    });

    it('should fail when rename module is invalid', done => {
      yargs.parse(
        `${_cmdArgs} --rename-module nonExistantModule`,
        (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
          expect({ error, output }).to.be.errorOnArgsParsing();

          done();
        }
      );
    });
  });

  context('with pattern', () => {
    it('should create a function when rename pattern string is provided', done => {
      // > recursive-copy srcPath destPath --rename-pattern a A
      yargs.parse(`${_cmdArgs} --rename-pattern a A`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: _args
        }).to.be.argsSuccessfullyParsed();
        expect(argv.rename).to.be.a('function');

        const _renameFn = argv.rename as RenameFn;
        expect(_renameFn('abca')).to.be.equal('Abca');

        done();
      });
    });

    it('should create a function when rename pattern regex is provided', done => {
      // > recursive-copy srcPath destPath /a/g A
      yargs.parse(
        `${_cmdArgs} --rename-pattern /a/g A`,
        (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: _args
          }).to.be.argsSuccessfullyParsed();
          expect(argv.rename).to.be.a('function');

          const _renameFn = argv.rename as RenameFn;
          expect(_renameFn('abca')).to.be.equal('AbcA');

          done();
        }
      );
    });

    it('should create a function when rename pattern regex with group capture is provided', done => {
      // > recursive-copy srcPath destPath --rename-pattern /(.*)-(.*)\\.(.*)/g $2-$1.$3  # author-title.mp3 to title-author.mp3
      yargs.parse(
        `${_cmdArgs} --rename-pattern /(.*)-(.*)\\.(.*)/g $2-$1.$3`,
        (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: _args
          }).to.be.argsSuccessfullyParsed();
          expect(argv.rename).to.be.a('function');

          const _renameFn = argv.rename as RenameFn;
          expect(_renameFn('author-title.mp3')).to.be.equal('title-author.mp3');

          done();
        }
      );
    });
  });
});
