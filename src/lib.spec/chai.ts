import chai from 'chai';
import chaiArrays from 'chai-arrays';
import { customAssert } from './custom-asserts';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chaiSemver = require('chai-semver');
chai.use(chaiSemver);

chai.use(chaiArrays);
chai.use(customAssert);

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

export = chai;
