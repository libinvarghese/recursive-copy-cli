// eslint-disable-next-line node/no-unpublished-import,import/default
import gitP from 'simple-git';
const git = gitP();

void (async (): Promise<void> => {
  const _gitStatus = await git.status();
  const _notStaged = _gitStatus.files.filter(status => status.working_dir !== ' ');
  if (_notStaged.length > 0) {
    console.error(`Changes not staged present! Please run 'git add' or 'git checkout'!`);
    _notStaged.map(file => file.path).forEach(file => console.error(file));
    process.exitCode = 1;
  }
})();
