// Refer https://docs.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates for
// syntax

import { developBranch } from './utils/constants';

const commitMessage = {
  prefix: 'chore',
  'prefix-development': 'chore',
  include: 'scope',
};

const packageSettings = {
  directory: '/',
  schedule: {
    interval: 'daily',
    time: '23:30',
    timezone: 'Asia/Kolkata',
  },
  'open-pull-requests-limit': 5,
  'target-branch': developBranch,
  // reviewers: ['libinvarghese'],
  assignees: ['libinvarghese'],
  allow: [
    {
      'dependency-type': 'direct',
    },
  ] as unknown,
  'commit-message': commitMessage,
};

const npmSettings = {
  ...packageSettings,
  'package-ecosystem': 'npm',
  'commit-message': { ...commitMessage, prefix: 'fix' },
};
const pipSettings = { ...packageSettings, 'package-ecosystem': 'pip' };
const githubActionSettings = {
  ...packageSettings,
  'package-ecosystem': 'github-actions',
  directory: '/.github/dependabotGithubActions/',
};
delete githubActionSettings.allow;

export = {
  version: 2,
  updates: [npmSettings, pipSettings, githubActionSettings],
};
