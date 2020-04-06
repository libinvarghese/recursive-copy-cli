import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';

import { RecursiveCopyCliModel } from '../../cli-model';
import { usageRegexp } from './constants';

// eslint-disable-next-line mocha/no-setup-in-describe
describe('value options', () => {
  const cliOtherOptions: {
    [key: string]: { alias: string; value: string | number; mapKey?: string };
  } = {
    concurrency: {
      alias: 'c',
      value: 10
    }
  };

  // eslint-disable-next-line mocha/no-setup-in-describe
  Object.keys(cliOtherOptions).forEach(key => {
    context(`option ${key}`, () => {
      let args: {
        [key: string]: string;
      };
      let cmdArgs: string;

      before(() => {
        args = {
          src: 'srcPath',
          dest: 'destPath'
        };
        cmdArgs = `${args.src} ${args.dest}`;
      });

      it('should be undefined when not specified', done => {
        yargs.parse(`${cmdArgs}`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect(error).to.not.exist;
          expect(output).to.empty;
          expect(argv).to.include(args);
          expect(argv).to.not.have.property(key);
          if (cliOtherOptions[key].mapKey) {
            expect(argv).to.not.have.property(cliOtherOptions[key].mapKey as string);
          }

          done();
        });
      });

      it('should have value when set', done => {
        yargs.parse(
          `${cmdArgs} --${key} ${cliOtherOptions[key].value}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect(error).to.not.exist;
            expect(output).to.empty;
            expect(argv).to.include(args);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[key]).to.be.equal(cliOtherOptions[key].value);

            done();
          }
        );
      });

      it('should have value when set via alias', done => {
        yargs.parse(
          `${cmdArgs} --${cliOtherOptions[key].alias} ${cliOtherOptions[key].value}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect(error).to.not.exist;
            expect(output).to.empty;
            expect(argv).to.include(args);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[key]).to.be.equal(cliOtherOptions[key].value);

            done();
          }
        );
      });

      it('should fail when no argument is passed with ${key}', done => {
        yargs.parse(`${cmdArgs} --${key}`, (error: Error, _argv: RecursiveCopyCliModel, output: unknown) => {
          expect(error).to.exist;
          expect(output).to.match(usageRegexp);

          done();
        });
      });
    });
  });
});
