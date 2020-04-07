import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';
import { usageRegexp } from '../../lib.spec/constants';

describe('cli basics', () => {
  it('should have options to show help', done => {
    yargs.parse('--help', (error: unknown, _: unknown, output: unknown) => {
      expect(error).to.not.exist;
      expect(output).to.match(usageRegexp);

      done();
    });
  });

  it('should have options to show version', done => {
    yargs.parse('--version', (error: unknown, _: unknown, output: unknown) => {
      expect(error).to.not.exist;
      expect(output).to.be.semver();
      done();
    });
  });
});
