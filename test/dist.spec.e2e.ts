/* eslint-disable no-console */
import { promisify } from 'util';
import { expect } from 'chai';
import { chaiExecAsync } from '@jsdevtools/chai-exec';
import rimraf from 'rimraf';

describe('dist', () => {
  let rimrafP: (path: string) => Promise<void>;

  before(() => {
    rimrafP = promisify(rimraf);
  });

  describe('basic cli operation', () => {
    const destPath = 'test/fixtures/destination';

    beforeEach(async () => {
      await rimrafP(destPath);
    });

    it('should copy single files via cli', async () => {
      const cmd = 'node dist/src/cli.js';
      const testItem = 'file';
      const sourcePath = 'test/fixtures/source';

      const cliResult = await chaiExecAsync(`${cmd} ${sourcePath}/${testItem} ${destPath}/${testItem}`);

      expect(cliResult).to.exit.with.code(0);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(cliResult).stderr.to.be.empty;
      expect(cliResult).stdout.to.contains('1 item(s) copied');

      expect(`${destPath}/${testItem}`).to.be.file().and.equal(`${sourcePath}/${testItem}`);
    });
  });
});
