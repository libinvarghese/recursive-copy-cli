/* eslint-disable no-console */
import { expect } from 'chai';
import mock from 'mock-fs';
import { bootstrapCli } from './bootstrap-cli';
import sinon, { SinonSpy, SinonSandbox } from 'sinon';
import { chaiExecAsync } from '@jsdevtools/chai-exec';
import rimraf from 'rimraf';
import { promisify } from 'util';
import { promises } from 'fs';

describe('cli', () => {
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
      const _cmd = 'npx ts-node src/cli.ts';
      const _testItem = 'file';
      const _sourcePath = 'test/fixtures/source';

      const _cliResult = await chaiExecAsync(`${_cmd} ${_sourcePath}/${_testItem} ${_destPath}/${_testItem}`);

      expect(_cliResult).to.exit.with.code(0);
      expect(_cliResult).stderr.to.be.empty;
      expect(_cliResult).stdout.to.contains('1 item(s) copied');

      expect(`${_destPath}/${_testItem}`)
        .to.be.file()
        .and.equal(`${_sourcePath}/${_testItem}`);
    });
  });

  describe('bootstrap-cli', () => {
    const _consoleSpy: {
      log: SinonSpy;
      error: SinonSpy;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = {} as any;
    const _sourcePath = 'source';
    const _destPath = 'destination';
    let _sandbox: SinonSandbox;
    let _fsMock;

    before(() => {
      _sandbox = sinon.createSandbox();

      _fsMock = {
        file: 'Hello, world!\n',
        symlink: mock.symlink({
          path: 'file'
        }),
        'nested-file': {
          file: 'Hello, world!\n'
        },
        empty: {},
        directory: {
          a: 'a\n',
          b: 'b\n',
          c: 'c\n'
        },
        'renamed-directory': {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          A: 'a\n',
          b: 'b\n',
          c: 'c\n'
        },
        'transformed-directory': {
          a: 'A\n',
          b: 'B\n',
          c: 'C\n'
        },
        'symlink-directory': mock.symlink({
          path: 'directory'
        }),
        'nested-symlinks': {
          file: mock.symlink({
            path: '../file'
          }),
          directory: mock.symlink({
            path: '../directory'
          }),
          nested: {
            directory: mock.symlink({
              path: '../../directory'
            })
          }
        },
        'nested-directory': {
          '1': {
            '1-1': {
              '1-1-a': '1-1-a\n',
              '1-1-b': '1-1-b\n'
            },
            '1-2': {
              '1-2-a': '1-2-a\n',
              '1-2-b': '1-2-b\n'
            },
            '1-a': '1-a\n',
            '1-b': '1-b\n'
          },
          '2': {
            '2-1': {
              '2-1-a': '2-1-a\n',
              '2-1-b': '2-1-b\n'
            },
            '2-2': {
              '2-2-a': '2-2-a\n',
              '2-2-b': '2-2-b\n'
            },
            '2-a': '2-a\n',
            '2-b': '2-b\n'
          },
          a: 'a\n',
          b: 'b\n'
        },
        'renamed-nested-directory': {
          '1': {
            '11': {
              '11A': '1-1-a\n',
              '11B': '1-1-b\n'
            },
            '12': {
              '12A': '1-2-a\n',
              '12B': '1-2-b\n'
            },
            '1A': '1-a\n',
            '1B': '1-b\n'
          },
          '2': {
            '21': {
              '21A': '2-1-a\n',
              '21B': '2-1-b\n'
            },
            '22': {
              '22A': '2-2-a\n',
              '22B': '2-2-b\n'
            },
            '2A': '2-a\n',
            '2B': '2-b\n'
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          A: 'a\n',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          B: 'b\n'
        },
        'filtered-nested-directory': {
          '1': {},
          '2': {
            '2-1': {
              '2-1-a': '2-1-a\n',
              '2-1-b': '2-1-b\n'
            },
            '2-2': {
              '2-2-a': '2-2-a\n',
              '2-2-b': '2-2-b\n'
            },
            '2-a': '2-a\n',
            '2-b': '2-b\n'
          },
          a: 'a\n',
          b: 'b\n'
        },
        dotfiles: {
          '.a': '.a\n',
          '.b': '.b\n',
          a: 'a\n',
          b: 'b\n'
        },
        'dotfiles-directory-without-dotfiles': {
          a: 'a\n',
          b: 'b\n'
        },
        junk: {
          a: 'a\n',
          b: 'b\n',
          'npm-debug.log': 'npm-debug.log\n',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Thumbs.db': 'Thumbs.db\n'
        },
        'junk-directory-without-junk': {
          a: 'a\n',
          b: 'b\n'
        }
      };

      mock({
        source: _fsMock
      });
    });

    after(() => {
      mock.restore();
    });

    beforeEach(async () => {
      await _rimrafP(_destPath);
      await promises.mkdir(_destPath);

      _consoleSpy.log = _sandbox.spy(console, 'log');
      _consoleSpy.error = _sandbox.spy(console, 'error');
    });

    afterEach(() => _sandbox.restore());

    describe('basic operation', () => {
      it('should copy single files', async () => {
        const _testItem = 'file';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${_destPath}/${_testItem}`)
          .to.be.file()
          .and.equal(`${_sourcePath}/${_testItem}`);
      });

      it('should create parent directory if it does not exist', async () => {
        const _testItem = 'nested-file/file';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${_destPath}/${_testItem}`)
          .to.be.file()
          .and.equal(`${_sourcePath}/${_testItem}`);
      });

      it('should copy empty directories', async () => {
        const _testItem = 'empty';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/${_testItem}`);
      });

      it('should copy directories', async () => {
        const _testItem = 'directory';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        expect(console.log).to.have.been.calledWithMatch('4 item(s) copied');

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/${_testItem}`);
      });

      it('should copy nested directories', async () => {
        const _testItem = 'nested-directory';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/${_testItem}`);
      });

      it('should copy symlink', async () => {
        const _testItem = 'symlink';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${_destPath}/${_testItem}`).to.be.symlink();
      });

      it('should copy nested symlink', async () => {
        const _testItem = 'nested-symlinks';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.equal(`${_sourcePath}/${_testItem}`);
      });
    });

    describe('options', () => {
      it('should overwrite destination file if overwrite is specified', async () => {
        const _testItem = 'file';

        await promises.writeFile(`${_destPath}/${_testItem}`, 'Goodbye, world!\n');

        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`, '--overwrite']);
        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${_destPath}/${_testItem}`)
          .to.be.file()
          .and.equal(`${_sourcePath}/${_testItem}`);
      });

      it('should overwrite destination symlink if overwrite is specified', async () => {
        const _testItem = 'file';

        await promises.symlink('./symlink', `${_destPath}/${_testItem}`, 'file');

        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`, '--overwrite']);
        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${_destPath}/${_testItem}`)
          .to.be.file()
          .and.equal(`${_sourcePath}/${_testItem}`);
      });

      it('should overwrite destination directory if overwrite is specified', async () => {
        const _testItem = 'file';

        await promises.mkdir(`${_destPath}/${_testItem}`);

        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`, '--overwrite']);
        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${_destPath}/${_testItem}`)
          .to.be.file()
          .and.equal(`${_sourcePath}/${_testItem}`);
      });

      it('should not copy dotfiles if dotfiles is not specified', async () => {
        const _testItem = 'dotfiles';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/dotfiles-directory-without-dotfiles`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/dotfiles-directory-without-dotfiles`);
      });

      it('should copy dotfiles if dotfiles is specified', async () => {
        const _testItem = 'dotfiles';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`, '--dot']);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/${_testItem}`);
      });

      it('should not copy dotfiles if dotfiles is specified', async () => {
        const _testItem = 'dotfiles';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`, '--no-dot']);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/dotfiles-directory-without-dotfiles`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/dotfiles-directory-without-dotfiles`);
      });

      it('should not copy junk files if junk is not specified', async () => {
        const _testItem = 'junk';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/junk-directory-without-junk`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/junk-directory-without-junk`);
      });

      it('should copy junk files if junk is specified', async () => {
        const _testItem = 'junk';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`, '--junk']);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/${_testItem}`);
      });

      it('should expand symlinked source files if expand is specified', async () => {
        const _testItem = 'symlink';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/expanded-${_testItem}`, '--expand']);
        expect(console.log).to.have.been.calledWithMatch('1 item(s) copied');

        expect(`${_destPath}/expanded-${_testItem}`).not.to.be.symlink();
        expect(`${_destPath}/expanded-${_testItem}`)
          .to.be.file()
          .and.equal(`${_sourcePath}/${_testItem}`);
      });

      it('should expand symlinked source directories if expand is specified', async () => {
        const _testItem = 'symlink-directory';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/expanded-${_testItem}`, '--expand']);

        expect(`${_destPath}/expanded-${_testItem}`).not.to.be.symlink();
        const _isDirectory = expect(`${_destPath}/expanded-${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/${_testItem}`);
      });

      it('should expand nested symlinks if expand is specified', async () => {
        const _testItem = 'nested-symlinks';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/expanded-${_testItem}`, '--expand']);

        expect(`${_destPath}/expanded-${_testItem}`).to.be.directory();
        expect(`${_destPath}/expanded-${_testItem}/file`).not.to.be.symlink();
        expect(`${_destPath}/expanded-${_testItem}/directory`).not.to.be.symlink();
        expect(`${_destPath}/expanded-${_testItem}/nested/directory`).not.to.be.symlink();
      });
    });

    describe('output transformation', () => {
      it('should filter output files via regular expression', async () => {
        const _testItem = 'nested-directory';
        await bootstrapCli([
          `${_sourcePath}/${_testItem}`,
          `${_destPath}/${_testItem}`,
          '--filter',
          '/(^[^1].*$)|(^1$)/'
        ]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/filtered-${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/filtered-${_testItem}`);
      });

      it('should filter output files via glob', async () => {
        const _testItem = 'nested-directory';
        await bootstrapCli([
          `${_sourcePath}/${_testItem}`,
          `${_destPath}/${_testItem}`,
          '--filter',
          '2/**/*',
          '{1,a,b}'
        ]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/filtered-${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/filtered-${_testItem}`);
      });

      it('should combine multiple filters from arrays', async () => {
        const _testItem = 'nested-directory';
        await bootstrapCli([
          `${_sourcePath}/${_testItem}`,
          `${_destPath}/${_testItem}`,
          '--filter',
          '2/**/*',
          '1',
          '/^[^1]$/'
        ]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/filtered-${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/filtered-${_testItem}`);
      });

      it('should rename files via string patterns', async () => {
        const _testItem = 'directory';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`, '--rename-pattern', 'a', 'A']);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/renamed-${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/renamed-${_testItem}`);
      });

      it('should rename files via regexp patterns', async () => {
        const _testItem = 'directory';
        await bootstrapCli([
          `${_sourcePath}/${_testItem}`,
          `${_destPath}/${_testItem}`,
          '--rename-pattern',
          '/a/',
          'A'
        ]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/renamed-${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/renamed-${_testItem}`);
      });

      // TODO: require of modules within yargs fails
      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('should rename files via rename local module', async () => {
        const _testItem = 'nested-directory';
        await bootstrapCli([
          `${_sourcePath}/${_testItem}`,
          `${_destPath}/${_testItem}`,
          '--rename-module',
          'pascalcase'
        ]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/renamed-${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/renamed-${_testItem}`);
      });

      // TODO: require of modules within yargs fails
      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('should rename files via rename local file module', async () => {
        const _testItem = 'nested-directory';
        await bootstrapCli([
          `${_sourcePath}/${_testItem}`,
          `${_destPath}/${_testItem}`,
          '--rename-module',
          './src/mocks.spec/toupper.rename.module.mock.ts'
        ]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/renamed-${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/renamed-${_testItem}`);
      });

      // TODO: require of modules within yargs fails
      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('should transform files', async () => {
        const _testItem = 'directory';
        await bootstrapCli([
          `${_sourcePath}/${_testItem}`,
          `${_destPath}/${_testItem}`,
          '--transform-module',
          './src/mocks.spec/toupper.transform.module.mock.ts'
        ]);

        const _isDirectory = expect(`${_destPath}/${_testItem}`).to.be.directory();
        _isDirectory.and.deep.equal(`${_sourcePath}/transformed-${_testItem}`);
        _isDirectory.and.contentsEquals(`${_sourcePath}/transformed-${_testItem}`);
      });
    });

    describe('argument validation', () => {
      it('should throw an error if the source path does not exist', async () => {
        const _testItem = 'nonexistent';
        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        expect(console.error).to.have.been.called;
        expect(`${_destPath}/${_testItem}`).not.to.be.path();
      });

      it('should throw an error if the destination path exists (single file)', async () => {
        const _testItem = 'file';

        await promises.writeFile(`${_destPath}/${_testItem}`, 'Goodbye, world!\n');

        await bootstrapCli([`${_sourcePath}/${_testItem}`, `${_destPath}/${_testItem}`]);

        expect(console.error).to.have.been.called;
        expect(`${_destPath}/${_testItem}`)
          .to.be.file()
          .and.not.equal(`${_sourcePath}/${_testItem}`);
      });
    });
  });
});
