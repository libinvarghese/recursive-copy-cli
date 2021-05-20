import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import { usageRegexp } from '../../lib.spec/constants';

describe('cli basics', () => {
  it('should have options to show help', done => {
    // > recursive-copy --help
    yargs.parse('--help', (error: unknown, _argv: unknown, output: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(error).not.to.exist;
      expect(output).to.match(usageRegexp);

      done();
    });
  });

  it('should have options to show version', done => {
    // > recursive-copy --version
    yargs.parse('--version', (error: unknown, _argv: unknown, output: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(error).not.to.exist;
      expect(output).to.be.semver();
      done();
    });
  });
});
