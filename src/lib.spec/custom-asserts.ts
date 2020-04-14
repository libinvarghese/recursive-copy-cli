import { RecursiveCopyCliModel } from '../cli.model';
import { usageRegexp } from './constants';

export const customAssert: Chai.ChaiPlugin = (chai: Chai.ChaiStatic, _utils: Chai.ChaiUtils) => {
  const Assertion = chai.Assertion;

  Assertion.addMethod('argsSuccessfullyParsed', function() {
    const {
      error,
      argv,
      output,
      args
    }: {
      error: Error;
      argv: RecursiveCopyCliModel;
      output: unknown;
      args: {
        [key: string]: string;
      };
    } = this._obj;

    new Assertion(error).to.not.exist;
    new Assertion(output).to.empty;
    new Assertion(argv).to.include(args);
  });

  Assertion.addMethod('errorOnArgsParsing', function() {
    const {
      error,
      output
    }: {
      error: Error;
      output: unknown;
    } = this._obj;

    new Assertion(error).to.exist;
    new Assertion(output).to.match(usageRegexp);
  });
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Chai {
    interface Assertion {
      argsSuccessfullyParsed(): Assertion;
      errorOnArgsParsing(): Assertion;
    }
  }
}
