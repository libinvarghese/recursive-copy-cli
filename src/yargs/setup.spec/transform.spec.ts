import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import { RecursiveCopyCliModel } from '../../cli.model';

describe('transform option', () => {
  let _args: {
    [key: string]: string;
  };
  let _cmdArgs: string;

  before(() => {
    _args = {
      src: 'srcPath',
      dest: 'destPath',
    };
    _cmdArgs = `${_args.src} ${_args.dest}`;
  });

  it('should be undefined when not specified', done => {
    yargs.parse(`${_cmdArgs}`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
      expect({
        error,
        argv,
        output,
        args: _args,
      }).to.be.argsSuccessfullyParsed();
      expect(argv).not.to.have.property('transform');

      done();
    });
  });

  it('should create a function when transform module is provided', done => {
    // > recursive-copy srcPath destPath --transform-module ./src/mocks.spec/toupper.transform.module.mock.ts
    yargs.parse(
      `${_cmdArgs} --transform-module ./src/mocks.spec/toupper.transform.module.mock.ts`,
      (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: _args,
        }).to.be.argsSuccessfullyParsed();
        expect(argv.transform).to.be.a('function');

        done();
      }
    );
  });

  it('should create a function when multiple transform modules are provided', done => {
    // > recursive-copy srcPath destPath --transform-module ./src/mocks.spec/toupper.transform.module.mock.ts \
    //     ./src/mocks.spec/eol.transform.module.mock.ts
    yargs.parse(
      `${_cmdArgs} --transform-module ./src/mocks.spec/toupper.transform.module.mock.ts ./src/mocks.spec/eol.transform.module.mock.ts`,
      (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: _args,
        }).to.be.argsSuccessfullyParsed();
        expect(argv.transform).to.be.a('function');

        done();
      }
    );
  });

  it('should fail when transform module is invalid', done => {
    yargs.parse(
      `${_cmdArgs} --transform-module nonExistantModule`,
      (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
        expect({ error, output }).to.be.errorOnArgsParsing();

        done();
      }
    );
  });
});
