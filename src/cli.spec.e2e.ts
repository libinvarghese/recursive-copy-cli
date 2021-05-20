/* eslint-disable no-console */
import { promisify } from 'util';
import { promises } from 'fs';
import { expect } from 'chai';
import mock from 'mock-fs';
import sinon, { SinonSpy, SinonSandbox } from 'sinon';
import { chaiExecAsync } from '@jsdevtools/chai-exec';
import rimraf from 'rimraf';
import { bootstrapCli } from './bootstrap-cli';

describe('cli', () => {
  let rimrafP: (path: string) => Promise<void>;
  const cmd = 'npx ts-node src/cli.ts';
  const destPath = 'test/fixtures/destination';
  const sourcePath = 'test/fixtures/source';

  before(() => {
    rimrafP = promisify(rimraf);
  });

  beforeEach(async () => {
    await rimrafP(destPath);
  });

  describe('basic cli operation', () => {
    it('should copy single files via cli', async () => {
      const testItem = 'file';

      const cliResult = await chaiExecAsync(`${cmd} ${sourcePath}/${testItem} ${destPath}/${testItem}`);

      expect(cliResult).to.exit.with.code(0);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(cliResult).stderr.to.be.empty;
      expect(cliResult).stdout.to.contains('1 item(s) copied');

      expect(`${destPath}/${testItem}`).to.be.file().and.equal(`${sourcePath}/${testItem}`);
    });

    // For some reason testing of loading of modules via mocha fails in bootstrap-cli
    describe('output transformation', () => {
      it('should rename files via rename local module', async () => {
        const testItem = 'nested-directory';
        const cliResult = await chaiExecAsync(
          `${cmd} ${sourcePath}/${testItem} ${destPath}/${testItem} --rename-module src/mocks.spec/toupper.rename.module.mock.ts`
        );

        expect(cliResult).to.exit.with.code(0);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(cliResult).stderr.to.be.empty;

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/renamed-${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/renamed-${testItem}`);
      });

      it('should transform files', async () => {
        const testItem = 'directory';
        const cliResult = await chaiExecAsync(
          `${cmd} ${sourcePath}/${testItem} ${destPath}/${testItem} --transform-module src/mocks.spec/toupper.transform.module.mock.ts`
        );

        expect(cliResult).to.exit.with.code(0);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(cliResult).stderr.to.be.empty;

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/transformed-${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/transformed-${testItem}`);
      });
    });
  });

  describe('bootstrap-cli', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const consoleSpy: {
      log: SinonSpy;
      error: SinonSpy;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = {} as any;
    const sourcePath = 'source';
    const destPath = 'destination';
    let sandbox: SinonSandbox;
    let fsMock;

    before(() => {
      sandbox = sinon.createSandbox();

      /* eslint-disable id-length */
      fsMock = {
        file: 'Hello, world!\n',
        symlink: mock.symlink({
          path: 'file',
        }),
        'nested-file': {
          file: 'Hello, world!\n',
        },
        empty: {},
        directory: {
          a: 'a\n',
          b: 'b\n',
          c: 'c\n',
        },
        'renamed-directory': {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          A: 'a\n',
          b: 'b\n',
          c: 'c\n',
        },
        'symlink-directory': mock.symlink({
          path: 'directory',
        }),
        'nested-symlinks': {
          file: mock.symlink({
            path: '../file',
          }),
          directory: mock.symlink({
            path: '../directory',
          }),
          nested: {
            directory: mock.symlink({
              path: '../../directory',
            }),
          },
        },
        'nested-directory': {
          '1': {
            '1-1': {
              '1-1-a': '1-1-a\n',
              '1-1-b': '1-1-b\n',
            },
            '1-2': {
              '1-2-a': '1-2-a\n',
              '1-2-b': '1-2-b\n',
            },
            '1-a': '1-a\n',
            '1-b': '1-b\n',
          },
          '2': {
            '2-1': {
              '2-1-a': '2-1-a\n',
              '2-1-b': '2-1-b\n',
            },
            '2-2': {
              '2-2-a': '2-2-a\n',
              '2-2-b': '2-2-b\n',
            },
            '2-a': '2-a\n',
            '2-b': '2-b\n',
          },
          a: 'a\n',
          b: 'b\n',
        },
        'filtered-nested-directory': {
          '1': {},
          '2': {
            '2-1': {
              '2-1-a': '2-1-a\n',
              '2-1-b': '2-1-b\n',
            },
            '2-2': {
              '2-2-a': '2-2-a\n',
              '2-2-b': '2-2-b\n',
            },
            '2-a': '2-a\n',
            '2-b': '2-b\n',
          },
          a: 'a\n',
          b: 'b\n',
        },
        dotfiles: {
          '.a': '.a\n',
          '.b': '.b\n',
          a: 'a\n',
          b: 'b\n',
        },
        'dotfiles-directory-without-dotfiles': {
          a: 'a\n',
          b: 'b\n',
        },
        junk: {
          a: 'a\n',
          b: 'b\n',
          'npm-debug.log': 'npm-debug.log\n',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Thumbs.db': 'Thumbs.db\n',
        },
        'junk-directory-without-junk': {
          a: 'a\n',
          b: 'b\n',
        },
      };
      /* eslint-enable id-length */

      mock({
        source: fsMock,
      });
    });

    after(() => {
      mock.restore();
    });

    beforeEach(async () => {
      await rimrafP(destPath);
      await promises.mkdir(destPath);

      consoleSpy.log = sandbox.spy(console, 'log');
      consoleSpy.error = sandbox.spy(console, 'error');
    });

    afterEach(() => sandbox.restore());

    describe('basic operation', () => {
      it('should copy single files', async () => {
        const testItem = 'file';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${destPath}/${testItem}`).to.be.file().and.equal(`${sourcePath}/${testItem}`);
      });

      it('should create parent directory if it does not exist', async () => {
        const testItem = 'nested-file/file';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${destPath}/${testItem}`).to.be.file().and.equal(`${sourcePath}/${testItem}`);
      });

      it('should copy empty directories', async () => {
        const testItem = 'empty';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/${testItem}`);
      });

      it('should copy directories', async () => {
        const testItem = 'directory';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        expect(console.log).to.have.been.calledWithMatch('4 item(s) copied');

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/${testItem}`);
      });

      it('should copy nested directories', async () => {
        const testItem = 'nested-directory';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/${testItem}`);
      });

      it('should copy symlink', async () => {
        const testItem = 'symlink';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${destPath}/${testItem}`).to.be.symlink();
      });

      it('should copy nested symlink', async () => {
        const testItem = 'nested-symlinks';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.equal(`${sourcePath}/${testItem}`);
      });
    });

    describe('options', () => {
      it('should overwrite destination file if overwrite is specified', async () => {
        const testItem = 'file';

        await promises.writeFile(`${destPath}/${testItem}`, 'Goodbye, world!\n');

        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`, '--overwrite']);
        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${destPath}/${testItem}`).to.be.file().and.equal(`${sourcePath}/${testItem}`);
      });

      it('should overwrite destination symlink if overwrite is specified', async () => {
        const testItem = 'file';

        await promises.symlink('./symlink', `${destPath}/${testItem}`, 'file');

        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`, '--overwrite']);
        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${destPath}/${testItem}`).to.be.file().and.equal(`${sourcePath}/${testItem}`);
      });

      it('should overwrite destination directory if overwrite is specified', async () => {
        const testItem = 'file';

        await promises.mkdir(`${destPath}/${testItem}`);

        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`, '--overwrite']);
        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${destPath}/${testItem}`).to.be.file().and.equal(`${sourcePath}/${testItem}`);
      });

      it('should not copy dotfiles if dotfiles is not specified', async () => {
        const testItem = 'dotfiles';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/dotfiles-directory-without-dotfiles`);
        isDirectory.and.contentsEquals(`${sourcePath}/dotfiles-directory-without-dotfiles`);
      });

      it('should copy dotfiles if dotfiles is specified', async () => {
        const testItem = 'dotfiles';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`, '--dot']);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/${testItem}`);
      });

      it('should not copy dotfiles if dotfiles is specified', async () => {
        const testItem = 'dotfiles';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`, '--no-dot']);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/dotfiles-directory-without-dotfiles`);
        isDirectory.and.contentsEquals(`${sourcePath}/dotfiles-directory-without-dotfiles`);
      });

      it('should not copy junk files if junk is not specified', async () => {
        const testItem = 'junk';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/junk-directory-without-junk`);
        isDirectory.and.contentsEquals(`${sourcePath}/junk-directory-without-junk`);
      });

      it('should copy junk files if junk is specified', async () => {
        const testItem = 'junk';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`, '--junk']);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/${testItem}`);
      });

      it('should expand symlinked source files if expand is specified', async () => {
        const testItem = 'symlink';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/expanded-${testItem}`, '--expand']);
        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${destPath}/expanded-${testItem}`).not.to.be.symlink();
        expect(`${destPath}/expanded-${testItem}`).to.be.file().and.equal(`${sourcePath}/${testItem}`);
      });

      it('should expand symlinked source directories if expand is specified', async () => {
        const testItem = 'symlink-directory';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/expanded-${testItem}`, '--expand']);

        expect(`${destPath}/expanded-${testItem}`).not.to.be.symlink();
        const isDirectory = expect(`${destPath}/expanded-${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/${testItem}`);
      });

      it('should expand nested symlinks if expand is specified', async () => {
        const testItem = 'nested-symlinks';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/expanded-${testItem}`, '--expand']);

        expect(`${destPath}/expanded-${testItem}`).to.be.directory();
        expect(`${destPath}/expanded-${testItem}/file`).not.to.be.symlink();
        expect(`${destPath}/expanded-${testItem}/directory`).not.to.be.symlink();
        expect(`${destPath}/expanded-${testItem}/nested/directory`).not.to.be.symlink();
      });
    });

    describe('output transformation', () => {
      it('should filter output files via regular expression', async () => {
        const testItem = 'nested-directory';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`, '--filter', '/(^[^1].*$)|(^1$)/']);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/filtered-${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/filtered-${testItem}`);
      });

      it('should filter output files via glob', async () => {
        const testItem = 'nested-directory';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`, '--filter', '2/**/*', '{1,a,b}']);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/filtered-${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/filtered-${testItem}`);
      });

      it('should combine multiple filters from arrays', async () => {
        const testItem = 'nested-directory';
        await bootstrapCli([
          `${sourcePath}/${testItem}`,
          `${destPath}/${testItem}`,
          '--filter',
          '2/**/*',
          '1',
          '/^[^1]$/',
        ]);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/filtered-${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/filtered-${testItem}`);
      });

      it('should rename files via string patterns', async () => {
        const testItem = 'directory';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`, '--rename-pattern', 'a', 'A']);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/renamed-${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/renamed-${testItem}`);
      });

      it('should rename files via regexp patterns', async () => {
        const testItem = 'directory';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`, '--rename-pattern', '/a/', 'A']);

        const isDirectory = expect(`${destPath}/${testItem}`).to.be.directory();
        isDirectory.and.deep.equal(`${sourcePath}/renamed-${testItem}`);
        isDirectory.and.contentsEquals(`${sourcePath}/renamed-${testItem}`);
      });
    });

    describe('argument validation', () => {
      it('should throw an error if the source path does not exist', async () => {
        const testItem = 'nonexistent';
        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(console.error).to.have.been.called;
        expect(`${destPath}/${testItem}`).not.to.be.path();
      });

      it('should throw an error if the destination path exists (single file)', async () => {
        const testItem = 'file';

        await promises.writeFile(`${destPath}/${testItem}`, 'Goodbye, world!\n');

        await bootstrapCli([`${sourcePath}/${testItem}`, `${destPath}/${testItem}`]);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(console.error).to.have.been.called;
        expect(`${destPath}/${testItem}`).to.be.file().and.not.equal(`${sourcePath}/${testItem}`);
      });
    });
  });
});
