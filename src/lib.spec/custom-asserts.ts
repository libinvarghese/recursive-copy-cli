import { RecursiveCopyCliModel } from '../cli.model';
import { usageRegexp } from './constants';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Chai {
    interface Assertion {
      argsSuccessfullyParsed(): Assertion;
      errorOnArgsParsing(): Assertion;

      contentsEquals(path: string, msg?: string): Assertion;
      symlink(msg?: string): Assertion;
    }
  }
}

export const customAssert: Chai.ChaiPlugin = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _Assertion = chai.Assertion;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const flag = utils.flag;

  _Assertion.addMethod('argsSuccessfullyParsed', function () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {
      error: _error,
      argv: _argv,
      output: _output,
      args: _args,
    }: {
      error: Error;
      argv: RecursiveCopyCliModel;
      output: unknown;
      args: {
        [key: string]: string;
      };
    } = this._obj;

    new _Assertion(_error).not.to.exist;
    new _Assertion(_output).to.empty;
    new _Assertion(_argv).to.include(_args);
  });

  _Assertion.addMethod('errorOnArgsParsing', function () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {
      error: _error,
      output: _output,
    }: {
      error: Error;
      output: unknown;
    } = this._obj;

    new _Assertion(_error).to.exist;
    new _Assertion(_output).to.match(usageRegexp);
  });

  // eslint-disable-next-line mocha/prefer-arrow-callback
  _Assertion.addChainableMethod('contentsEquals', function (expected: string, msg: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const _isDirectory = flag(this, 'fs.isDirectory');
    if (_isDirectory) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const dir: string = flag(this, 'object');

      let preMsg = '';
      if (msg) {
        flag(this, 'message', msg);
        preMsg = `${msg} : `;
      }

      new chai.Assertion(expected, preMsg + 'expected-value').is.a('string');
      new chai.Assertion(expected, preMsg + 'expected-value').to.be.a.path();
      new chai.Assertion(expected, preMsg + 'expected-value').to.be.a.directory();

      const _directory = new chai.Assertion(dir).to.be.directory();
      ((_directory.with.files as unknown) as Chai.Assertion).that.satisfy((files: string[]) =>
        files.every(file => {
          return new chai.Assertion(`${dir}/${file}`).to.be.file().and.equal(`${expected}/${file}`);
        })
      );

      ((_directory.with.subDirs as unknown) as Chai.Assertion).that.satisfy((subDirs: string[]) =>
        subDirs.every(subDir => {
          const _isSubDir = new chai.Assertion(`${dir}/${subDir}`).to.be.directory();
          return _isSubDir.and.contentsEquals(`${expected}/${subDir}`);
        })
      );
    }
  });
};
