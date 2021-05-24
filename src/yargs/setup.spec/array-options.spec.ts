import { expect } from 'chai';
import { camelCase } from 'lodash';
import { getYargsInstance } from '../setup';
import type { RecursiveCopyCliModel } from '../../cli.model';

// eslint-disable-next-line mocha/no-setup-in-describe
describe('array options', () => {
  const cliArrayOptions: Record<
    string,
    {
      alias: string;
      value: string[];
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      args?: 2;
      mapKey?: string;
    }
  > = {
    'rename-pattern': {
      alias: 'p',
      args: 2,
      value: ['a', 'b'],
      mapKey: 'rename',
    },
    'rename-module': {
      alias: 'r',
      value: ['pascalcase', './src/mocks.spec/toupper.rename.module.mock.ts'],
      mapKey: 'rename',
    },
    'transform-module': {
      alias: 't',
      value: ['./src/mocks.spec/toupper.transform.module.mock.ts', './src/mocks.spec/eol.transform.module.mock.ts'],
      mapKey: 'transform',
    },
    filter: {
      alias: 'f',
      value: ['*.ts', '*.js'],
    },
  };

  // eslint-disable-next-line mocha/no-setup-in-describe
  Object.keys(cliArrayOptions).forEach(key => {
    context(`option ${key}`, () => {
      let args = {} as Record<string, string>;
      let cmdArgs = '';

      before(() => {
        args = {
          src: 'srcPath',
          dest: 'destPath',
        };
        cmdArgs = `${args.src} ${args.dest}`;
      });

      it('should be undefined when not specified', done => {
        getYargsInstance().parseSync(
          cmdArgs,
          (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: args,
            }).to.be.argsSuccessfullyParsed();
            expect(argv).not.to.have.property(key);
            if (cliArrayOptions[key].mapKey !== undefined) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              expect(argv).not.to.have.property(cliArrayOptions[key].mapKey!);
            }

            done();
          }
        );
      });

      it('should have value when set', done => {
        getYargsInstance().parseSync(
          `${cmdArgs} --${key} ${cliArrayOptions[key].value.join(' ')}`,
          (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: args,
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            expect((argv as any)[camelCase(key)]).to.be.deep.equal(cliArrayOptions[key].value);
            if (cliArrayOptions[key].mapKey !== undefined) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              expect(argv).to.have.property(cliArrayOptions[key].mapKey!);
            }

            done();
          }
        );
      });

      it('should have value when set via alias', done => {
        getYargsInstance().parseSync(
          `${cmdArgs} --${cliArrayOptions[key].alias} ${cliArrayOptions[key].value.join(' ')}`,
          (error: Readonly<Error>, argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
            expect({
              error,
              argv,
              output,
              args: args,
            }).to.be.argsSuccessfullyParsed();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            expect((argv as any)[camelCase(key)]).to.be.deep.equal(cliArrayOptions[key].value);
            if (cliArrayOptions[key].mapKey !== undefined) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              expect(argv).to.have.property(cliArrayOptions[key].mapKey!);
            }

            done();
          }
        );
      });

      it(`should fail when no argument is passed with ${key}`, done => {
        getYargsInstance().parseSync(
          `${cmdArgs} --${key}`,
          (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
            expect({ error, output }).to.be.errorOnArgsParsing();

            done();
          }
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      if (cliArrayOptions[key].args) {
        context('when argument count is defined', () => {
          it(`should fail when more than required argument is passed with ${key}`, done => {
            const moreArgs = [...cliArrayOptions[key].value, cliArrayOptions[key].value[0]];
            getYargsInstance().parseSync(
              `${cmdArgs} --${key} ${moreArgs.join(' ')}`,
              (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
                expect({ error, output }).to.be.errorOnArgsParsing();

                done();
              }
            );
          });

          it('should fail when less than required argument is passed with concurrency', done => {
            const moreArgs = [...cliArrayOptions[key].value];
            moreArgs.pop();
            getYargsInstance().parseSync(
              `${cmdArgs} --${key} ${moreArgs.join(' ')}`,
              (error: Readonly<Error>, _argv: Readonly<RecursiveCopyCliModel>, output: unknown) => {
                expect({ error, output }).to.be.errorOnArgsParsing();

                done();
              }
            );
          });
        });
      }
    });
  });
});
