import { expect } from 'chai';

// eslint-disable-next-line import/default
import yargs from '../setup';
import { RecursiveCopyCliModel } from '../../cli-model';

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
    it('module', done => {
      yargs.parse(
        `${cmdArgs} --rename-module pascalcase`,
        (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect(error).to.not.exist;
          expect(output).to.empty;
          expect(argv).to.include(args);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect(argv.renameModule).to.be.equal('pascalcase');

          expect(argv.rename).to.be.a('function');

          const renameFn = argv.rename as (filePath: string) => string;
          expect(renameFn('foo bar baz')).to.be.equal('FooBarBaz');

          done();
        }
      );
    });
  });

  it('pattern & substitute');
  it('regex & substitute');
  it('pattern');
  it('pattern & regex');
  it('pattern & module');
  it('substitute');
  it('substitute & module');
  it('regex & module');
  it('pattern & regex & module');
  it('pattern & regex & string');
});
