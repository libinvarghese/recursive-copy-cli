import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import { RecursiveCopyCliModel } from '../../cli.model';
import { usageRegexp } from '../../lib.spec/constants';

describe('unknown arguments', () => {
  it('should fail when non-options arguments other than src & dest are passed', done => {
    yargs.parse('srcPath destPath someOtherArg', (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
      expect(error.message).to.contain('got 1');
      expect(output).to.match(usageRegexp);
      done();
    });
  });
});
