/* eslint-disable no-console */
import { promisify } from 'util';
import { expect } from 'chai';
import { chaiExecAsync } from '@jsdevtools/chai-exec';
import rimraf from 'rimraf';

describe('dist', () => {
  let _rimrafP: (path: string) => Promise<void>;

  before(() => {
    _rimrafP = promisify(rimraf);
  });

  describe('basic cli operation', () => {
    const _destPath = 'test/fixtures/destination';

    beforeEach(async () => {
      await _rimrafP(_destPath);
    });

    it('should copy single files via cli', async () => {
      const _cmd = 'node dist/src/cli.js';
      const _testItem = 'file';
      const _sourcePath = 'test/fixtures/source';

      const _cliResult = await chaiExecAsync(`${_cmd} ${_sourcePath}/${_testItem} ${_destPath}/${_testItem}`);

      expect(_cliResult).to.exit.with.code(0);
      expect(_cliResult).stderr.to.be.empty;
      expect(_cliResult).stdout.to.contains('1 item(s) copied');

      expect(`${_destPath}/${_testItem}`).to.be.file().and.equal(`${_sourcePath}/${_testItem}`);
    });
  });
});
