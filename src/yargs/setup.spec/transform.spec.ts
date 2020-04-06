import { expect } from 'chai';

// eslint-disable-next-line import/default
import yargs from '../setup';
import { RecursiveCopyCliModel } from '../../cli-model';
import { usageRegexp } from './constants';

describe('transform option', () => {
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
      expect(argv).to.not.have.property('transform');

      done();
    });
  });

  it('should create a function when transform module is provided', done => {
    yargs.parse(
      `${cmdArgs} --transform-module ./src/yargs/setup.spec/toupper.transform.module.mock.ts`,
      (_error: Error, argv: RecursiveCopyCliModel, _output: unknown) => {
        expect(argv.transform).to.be.a('function');

        done();
      }
    );
  });

  it('should create a function when multiple transform modules are provided', done => {
    yargs.parse(
      `${cmdArgs} --transform-module ./src/yargs/setup.spec/toupper.transform.module.mock.ts ./src/yargs/setup.spec/eol.transform.module.mock.ts`,
      (_error: Error, argv: RecursiveCopyCliModel, _output: unknown) => {
        expect(argv.transform).to.be.a('function');

        done();
      }
    );
  });

  it('should fail when transform module is invalid', done => {
    yargs.parse(
      `${cmdArgs} --transform-module nonExistantModule`,
      (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
        expect(error).to.exist;
        expect(output).to.match(usageRegexp);

        done();
      }
    );
  });
});
