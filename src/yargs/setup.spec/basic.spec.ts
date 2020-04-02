import chai, { expect } from 'chai';

// eslint-disable-next-line @typescript-eslint/no-var-requires, node/no-unpublished-require
const chaiSemver = require('chai-semver');
chai.use(chaiSemver);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Chai {
    interface Assertion {
      semver(): Assertion;
      satisfySemver(expected: string): Assertion;
    }

    // interface Assert {
    //   semver(val: unknown, msg?: string): void;
    //   satisfySemver(val: unknown, expected: string, msg?: string): void;
    // }
  }
}

// declare function chaiSemver: Chai.ChaiPlugin;

// eslint-disable-next-line import/default
import yargs from '../setup';
import { usageRegexp } from './constants';

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
