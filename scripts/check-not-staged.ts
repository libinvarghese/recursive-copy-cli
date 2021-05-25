// eslint-disable-next-line node/no-unpublished-import, import/default
import gitP from 'simple-git';
// eslint-disable-next-line node/no-unpublished-import
import type { FileStatusResult } from 'simple-git';

const git = gitP();

void (async (): Promise<void> => {
  const gitStatus = await git.status();
  const notStaged = gitStatus.files.filter((status: Readonly<FileStatusResult>) => status.working_dir !== ' ');
  if (notStaged.length > 0) {
    console.error(`Changes not staged present! Please run 'git add' or 'git checkout'!`);
    notStaged
      .map((file: Readonly<FileStatusResult>) => file.path)
      .forEach(file => {
        console.error(file);
      });
    process.exitCode = 1;
  }
})();
