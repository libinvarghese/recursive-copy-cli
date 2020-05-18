import { RecursiveCopyCliModel } from '../cli.model';
import { usageRegexp } from './constants';

export const customAssert: Chai.ChaiPlugin = (chai: Chai.ChaiStatic, _utils: Chai.ChaiUtils) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _Assertion = chai.Assertion;

  _Assertion.addMethod('argsSuccessfullyParsed', function() {
    const {
      error: _error,
      argv: _argv,
      output: _output,
      args: _args
    }: {
      error: Error;
      argv: RecursiveCopyCliModel;
      output: unknown;
      args: {
        [key: string]: string;
      };
    } = this._obj;

    new _Assertion(_error).to.not.exist;
    new _Assertion(_output).to.empty;
    new _Assertion(_argv).to.include(_args);
  });

  _Assertion.addMethod('errorOnArgsParsing', function() {
    const {
      error: _error,
      output: _output
    }: {
      error: Error;
      output: unknown;
    } = this._obj;

    new _Assertion(_error).to.exist;
    new _Assertion(_output).to.match(usageRegexp);
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
