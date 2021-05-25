import { expect } from 'chai';
// eslint-disable-next-line import/default
import { getYargsInstance } from '../setup';
import { usageRegexp } from '../../lib.spec/constants';
import type { RecursiveCopyCliModel } from '../../cli-model';

describe('src and dest is mandatory', () => {
  it('should parse src and dest when passed as arguments', done => {
    const args = {
      src: 'srcPath',
      dest: 'destPath',
    };
    // > recursive-copy srcPath destPath
    // eslint-disable-next-line node/no-sync
    getYargsInstance().parseSync(
      `${args.src} ${args.dest}`,
      (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect({
          error,
          argv,
          output,
          args: args,
        }).to.be.argsSuccessfullyParsed();

        done();
      }
    );
  });

  it('should fail when no arguments are passed', done => {
    // eslint-disable-next-line node/no-sync
    getYargsInstance().parseSync(
      '',
      (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect(error.message).to.contain('got 0');
        expect(output).to.match(usageRegexp);

        done();
      }
    );
  });

  it('should fail when only 1 argument is passed', done => {
    // eslint-disable-next-line node/no-sync
    getYargsInstance().parseSync(
      'srcPath',
      (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect(error.message).to.contain('got 1');
        expect(output).to.match(usageRegexp);

        done();
      }
    );
  });

  it('should fail when options are passed', done => {
    // eslint-disable-next-line node/no-sync
    getYargsInstance().parseSync(
      '--debug',
      (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect(error.message).to.contain('got 0');
        expect(output).to.match(usageRegexp);

        done();
      }
    );
  });
});
