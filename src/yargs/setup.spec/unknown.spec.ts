import { expect } from 'chai';
// eslint-disable-next-line import/default
import { getYargsInstance } from '../setup';
import { usageRegexp } from '../../lib.spec/constants';
import type { RecursiveCopyCliModel } from '../../cli-model';

describe('unknown arguments', () => {
  it('should fail when non-options arguments other than src & dest are passed', done => {
    // eslint-disable-next-line node/no-sync
    getYargsInstance().parseSync(
      'srcPath destPath someOtherArg',
      (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
        expect(error.message).to.contain('Unknown');
        expect(output).to.match(usageRegexp);
        done();
      }
    );
  });
});
