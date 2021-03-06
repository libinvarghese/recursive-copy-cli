import { expect } from 'chai';
// eslint-disable-next-line import/default
import { getYargsInstance } from '../setup';
import type { RecursiveCopyCliModel } from '../../cli-model';

describe('rename option', () => {
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
    // eslint-disable-next-line node/no-sync
    getYargsInstance().parseSync(
      cmdArgs,
      (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: args,
        }).to.be.argsSuccessfullyParsed();
        expect(argv).not.to.have.property('rename');

        done();
      }
    );
  });

  context('with module', () => {
    it('should create a function when rename module is provided', done => {
      // > recursive-copy srcPath destPath --renameModule pascalcase
      // eslint-disable-next-line node/no-sync
      getYargsInstance().parseSync(
        `${cmdArgs} --renameModule pascalcase`,
        (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: args,
          }).to.be.argsSuccessfullyParsed();
          expect(argv.rename).to.be.a('function');

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const renameFn = argv.rename!;
          expect(renameFn('foo bar baz')).to.be.equal('FooBarBaz');

          done();
        }
      );
    });

    it('should create a function when multiple rename modules are provided', done => {
      // > recursive-copy srcPath destPath --renameModule pascalcase ./src/mocks.spec/toupper.rename.module.mock.ts
      // eslint-disable-next-line node/no-sync
      getYargsInstance().parseSync(
        `${cmdArgs} --renameModule pascalcase ./src/mocks.spec/toupper.rename.module.mock.ts`,
        (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: args,
          }).to.be.argsSuccessfullyParsed();
          expect(argv.rename).to.be.a('function');

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const renameFn = argv.rename!;
          expect(renameFn('foo bar baz')).to.be.equal('FOOBARBAZ');

          done();
        }
      );
    });

    it('should fail when rename module is invalid', done => {
      // eslint-disable-next-line node/no-sync
      getYargsInstance().parseSync(
        `${cmdArgs} --renameModule nonExistantModule`,
        (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
          expect({ error, output }).to.be.errorOnArgsParsing();
          done();
        }
      );
    });
  });

  context('with pattern', () => {
    it('should create a function when rename pattern string is provided', done => {
      // > recursive-copy srcPath destPath --renamePattern a A
      // eslint-disable-next-line node/no-sync
      getYargsInstance().parseSync(
        `${cmdArgs} --renamePattern a A`,
        (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: args,
          }).to.be.argsSuccessfullyParsed();
          expect(argv.rename).to.be.a('function');

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const renameFn = argv.rename!;
          expect(renameFn('abca')).to.be.equal('Abca');

          done();
        }
      );
    });

    it('should create a function when rename pattern regex is provided', done => {
      // > recursive-copy srcPath destPath /a/g A
      // eslint-disable-next-line node/no-sync
      getYargsInstance().parseSync(
        `${cmdArgs} --renamePattern /a/g A`,
        (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: args,
          }).to.be.argsSuccessfullyParsed();
          expect(argv.rename).to.be.a('function');

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const renameFn = argv.rename!;
          expect(renameFn('abca')).to.be.equal('AbcA');

          done();
        }
      );
    });

    it('should create a function when rename pattern regex with group capture is provided', done => {
      // > recursive-copy srcPath destPath --renamePattern /(.*)-(.*)\\.(.*)/g $2-$1.$3  # author-title.mp3 to title-author.mp3
      // eslint-disable-next-line node/no-sync
      getYargsInstance().parseSync(
        `${cmdArgs} --renamePattern /(.*)-(.*)\\.(.*)/g $2-$1.$3`,
        (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
          expect({
            error,
            argv,
            output,
            args: args,
          }).to.be.argsSuccessfullyParsed();
          expect(argv.rename).to.be.a('function');

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const renameFn = argv.rename!;
          expect(renameFn('author-title.mp3')).to.be.equal('title-author.mp3');

          done();
        }
      );
    });
  });
});
