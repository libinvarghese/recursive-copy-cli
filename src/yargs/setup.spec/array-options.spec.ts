import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';

import { RecursiveCopyCliModel } from '../../cli-model';
import { usageRegexp } from './constants';

// eslint-disable-next-line mocha/no-setup-in-describe
describe('array options', () => {
  const cliArrayOptions: {
    [key: string]: { alias: string; value: string[]; args?: 2; mapKey: string };
  } = {
    'rename-pattern': {
      alias: 'p',
      args: 2,
      value: ['a', 'b'],
      mapKey: 'rename'
    },
    'rename-module': {
      alias: 'r',
      value: ['pascalcase', './src/yargs/setup.spec/toupper.module.mock.ts'],
      mapKey: 'rename'
    }
  };

  // eslint-disable-next-line mocha/no-setup-in-describe
  Object.keys(cliArrayOptions).forEach(key => {
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
          expect(argv).to.not.have.property(cliArrayOptions[key].mapKey);

          done();
        });
      });

      it('should have value when set', done => {
        yargs.parse(
          `${cmdArgs} --${key} ${cliArrayOptions[key].value.join(' ')}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect(error).to.not.exist;
            expect(output).to.empty;
            expect(argv).to.include(args);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[key]).to.be.deep.equal(cliArrayOptions[key].value);

            done();
          }
        );
      });

      it('should have value when set via alias', done => {
        yargs.parse(
          `${cmdArgs} --${cliArrayOptions[key].alias} ${cliArrayOptions[key].value.join(' ')}`,
          (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
            expect(error).to.not.exist;
            expect(output).to.empty;
            expect(argv).to.include(args);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((argv as any)[key]).to.be.deep.equal(cliArrayOptions[key].value);

            done();
          }
        );
      });

      it('should fail when no argument is passed with ${key}', done => {
        yargs.parse(`${cmdArgs} --${key}`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
          expect(error).to.exist;
          expect(output).to.match(usageRegexp);

          done();
        });
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      if (cliArrayOptions[key].args) {
        context('when argument count is defined', () => {
          it('should fail when more than required argument is passed with ${key}', done => {
            const moreArgs = [...cliArrayOptions[key].value, cliArrayOptions[key].value[0]];
            yargs.parse(
              `${cmdArgs} --${key} ${moreArgs.join(' ')}`,
              (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
                expect(error).to.exist;
                expect(output).to.match(usageRegexp);

                done();
              }
            );
          });

          it('should fail when less than required argument is passed with concurrency', done => {
            const moreArgs = [...cliArrayOptions[key].value];
            moreArgs.pop();
            yargs.parse(
              `${cmdArgs} --${key} ${moreArgs.join(' ')}`,
              (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
                expect(error).to.exist;
                expect(output).to.match(usageRegexp);

                done();
              }
            );
          });
        });
      }
    });
  });
});
