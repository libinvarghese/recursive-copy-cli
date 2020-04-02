import { expect } from 'chai';
// eslint-disable-next-line import/default
import yargs from '../setup';

import { RecursiveCopyCliModel } from '../../cli-model';
import { usageRegexp } from './constants';

// eslint-disable-next-line mocha/no-setup-in-describe
describe('other options', () => {
  context(`option concurrency`, () => {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(argv).to.not.have.property('concurrency');

        done();
      });
    });

    it('should be true when set', done => {
      yargs.parse(`${cmdArgs} --concurrency 10`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
        expect(error).to.not.exist;
        expect(output).to.empty;
        expect(argv).to.include(args);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(argv.concurrency).to.be.equal(10);

        done();
      });
    });

    it('should be true when set via alias', done => {
      yargs.parse(`${cmdArgs} -c 20`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
        expect(error).to.not.exist;
        expect(output).to.empty;
        expect(argv).to.include(args);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(argv.concurrency).to.be.equal(20);

        done();
      });
    });

    it('should fail when no argument is passed with concurrency', done => {
      yargs.parse(`${cmdArgs} --concurrency`, (error: Error, argv: RecursiveCopyCliModel, output: unknown) => {
        expect(error).to.exist;
        expect(output).to.match(usageRegexp);

        done();
      });
    });
  });
});
