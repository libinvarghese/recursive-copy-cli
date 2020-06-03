import chai from 'chai';
import chaiArrays from 'chai-arrays';
import { customAssert } from './custom-asserts';
import chaiExec from '@jsdevtools/chai-exec';
import chaiFs from 'chai-fs';
import sinonChai from 'sinon-chai';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chaiSemver = require('chai-semver');

chai.use(chaiSemver);
chai.use(chaiExec);
chai.use(chaiArrays);
chai.use(chaiFs);
chai.use(sinonChai);
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