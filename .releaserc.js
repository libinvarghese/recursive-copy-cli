const parserOpts = {
  noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
};

module.exports = {
  branches: [{ name: 'develop' }],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          // Default
          // {breaking: true, release: 'major'},
          // {revert: true, release: 'patch'},
          // // Angular
          // {type: 'feat', release: 'minor'},
          // {type: 'fix', release: 'patch'},
          // {type: 'perf', release: 'patch'}

          { type: 'docs', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'style', release: 'patch' },
          { type: 'test', release: 'patch' },
          { type: 'ci', release: 'patch' },
          { type: 'chore', release: 'patch' },
        ],
        parserOpts,
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        parserOpts,
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogTitle: `# Changelog

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.`,
      },
    ],
    [
      'semantic-release-git-branches',
      {
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        branchMerges: ['master', 'develop'],
      },
    ],
    ['@semantic-release/git'],
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist',
      },
    ],
    [
      '@semantic-release/github',
      {
        assignees: ['libinvarghese'],
        assets: ['dist/**'],
      },
    ],
  ],
  preset: 'angular',
};
