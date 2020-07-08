// Refer https://docs.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates for
// syntax

const packageSettings = {
  directory: '/',
  schedule: {
    interval: 'daily',
    time: '23:30',
    timezone: 'Asia/Kolkata',
  },
  'open-pull-requests-limit': 5,
  'target-branch': 'develop',
  // reviewers: ['libinvarghese'],
  assignees: ['libinvarghese'],
  allow: [
    {
      'dependency-type': 'direct',
    },
  ],
  'commit-message': {
    prefix: 'chore',
    'prefix-development': 'chore',
    include: 'scope',
  },
};

const npmSettings = { ...packageSettings, 'package-ecosystem': 'npm' };
npmSettings['commit-message'].prefix = 'fix';
const pipSettings = { ...packageSettings, 'package-ecosystem': 'pip' };
const githubActionSettings = { ...packageSettings, 'package-ecosystem': 'github-actions' };
delete githubActionSettings.allow;

export = {
  version: 2,
  updates: [npmSettings, pipSettings, githubActionSettings],
};
