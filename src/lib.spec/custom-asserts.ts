import { RecursiveCopyCliModel } from '../cli.model';
import { usageRegexp } from './constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Chai {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      error,
      argv,
      output,
      args,
    }: {
      error: Error;
      argv: RecursiveCopyCliModel;
      output: unknown;
      args: {
        [key: string]: string;
      };
    } = this._obj;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    new _Assertion(error).not.to.exist;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    new _Assertion(output).to.empty;
    new _Assertion(argv).to.include(args);
  });

  _Assertion.addMethod('errorOnArgsParsing', function () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {
      error,
      output,
    }: {
      error: Error;
      output: unknown;
    } = this._obj;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    new _Assertion(error).to.exist;
    new _Assertion(output).to.match(usageRegexp);
  });

  // eslint-disable-next-line mocha/prefer-arrow-callback
  _Assertion.addChainableMethod('contentsEquals', function (expected: string, msg: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const isDirectory = flag(this, 'fs.isDirectory');
    if (isDirectory) {
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

      const directory = new chai.Assertion(dir).to.be.directory();
      ((directory.with.files as unknown) as Chai.Assertion).that.satisfy((files: string[]) =>
        files.every(file => {
          return new chai.Assertion(`${dir}/${file}`).to.be.file().and.equal(`${expected}/${file}`);
        })
      );

      ((directory.with.subDirs as unknown) as Chai.Assertion).that.satisfy((subDirs: string[]) =>
        subDirs.every(subDir => {
          const isSubDir = new chai.Assertion(`${dir}/${subDir}`).to.be.directory();
          return isSubDir.and.contentsEquals(`${expected}/${subDir}`);
        })
      );
    }
  });
};
