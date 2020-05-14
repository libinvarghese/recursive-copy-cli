import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import { RecursiveCopyCliModel } from '../../cli.model';
import { usageRegexp } from '../../lib.spec/constants';

describe('src and dest is mandatory', () => {
  it('should parse src and dest when passed as arguments', done => {
    const _args = {
      src: 'srcPath',
      dest: 'destPath'
    };
    // > recursive-copy srcPath destPath
    yargs.parse(`${_args.src} ${_args.dest}`, (error: unknown, argv: RecursiveCopyCliModel, output: unknown) => {
      expect({ error, argv, output, args: _args }).to.be.argsSuccessfullyParsed();

      done();
    });
  });

  it('should fail when no arguments are passed', done => {
    yargs.parse('', (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
      expect(error.message).to.contain('got 0');
      expect(output).to.match(usageRegexp);

      done();
    });
  });

  it('should fail when only 1 argument is passed', done => {
    yargs.parse('srcPath', (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
      expect(error.message).to.contain('got 1');
      expect(output).to.match(usageRegexp);

      done();
    });
  });

  it('should fail when options are passed', done => {
    yargs.parse('--debug', (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
      expect(error.message).to.contain('got 0');
      expect(output).to.match(usageRegexp);

      done();
    });
  });
});
