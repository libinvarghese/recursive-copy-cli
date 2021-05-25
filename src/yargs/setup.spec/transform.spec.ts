import { expect } from 'chai';
// eslint-disable-next-line import/default
import { getYargsInstance } from '../setup';
import type { RecursiveCopyCliModel } from '../../cli-model';

describe('transform option', () => {
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
        expect(argv).not.to.have.property('transform');

        done();
      }
    );
  });

  it('should create a function when transform module is provided', done => {
    // > recursive-copy srcPath destPath --transform-module ./src/mocks.spec/toupper.transform.module.mock.ts
    // eslint-disable-next-line node/no-sync
    getYargsInstance().parseSync(
      `${cmdArgs} --transform-module ./src/mocks.spec/toupper.transform.module.mock.ts`,
      (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: args,
        }).to.be.argsSuccessfullyParsed();
        expect(argv.transform).to.be.a('function');

        done();
      }
    );
  });

  it('should create a function when multiple transform modules are provided', done => {
    // > recursive-copy srcPath destPath --transform-module ./src/mocks.spec/toupper.transform.module.mock.ts \
    //     ./src/mocks.spec/eol.transform.module.mock.ts
    // eslint-disable-next-line node/no-sync
    getYargsInstance().parseSync(
      `${cmdArgs} --transform-module ./src/mocks.spec/toupper.transform.module.mock.ts ./src/mocks.spec/eol.transform.module.mock.ts`,
      (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: args,
        }).to.be.argsSuccessfullyParsed();
        expect(argv.transform).to.be.a('function');

        done();
      }
    );
  });

  it('should fail when transform module is invalid', done => {
    // eslint-disable-next-line node/no-sync
    getYargsInstance().parseSync(
      `${cmdArgs} --transform-module nonExistantModule`,
      (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect({ error, output }).to.be.errorOnArgsParsing();

        done();
      }
    );
  });
});
