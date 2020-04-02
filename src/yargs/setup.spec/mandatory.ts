// eslint-disable-next-line node/no-unpublished-import
import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';

import { RecursiveCopyCliModel } from '../../cli-model';
import { usageRegexp } from './constants';

describe('src and dest is mandatory', () => {
  it('should parse src and dest when passed as arguments', done => {
    const args = {
      src: 'srcPath',
      dest: 'destPath'
    };
    yargs.parse(`${args.src} ${args.dest}`, (error: unknown, argv: RecursiveCopyCliModel, output: unknown) => {
      expect(error).to.not.exist;
      expect(output).to.empty;
      expect(argv).to.include(args);

      done();
    });
  });

  it('should fail when no arguments are passed', done => {
    yargs.parse('', (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
      expect(error.message).to.contain('got 0');
      expect(output).to.match(usageRegexp);

      done();
    });
  });

  it('should fail when only 1 argument is passed', done => {
    yargs.parse('srcPath', (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
      expect(error.message).to.contain('got 1');
      expect(output).to.match(usageRegexp);

      done();
    });
  });

  it('should fail when options are passed', done => {
    yargs.parse('--debug', (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
      expect(error.message).to.contain('got 0');
      expect(output).to.match(usageRegexp);

      done();
    });
  });
});
