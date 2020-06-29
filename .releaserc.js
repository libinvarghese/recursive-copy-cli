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
          // { type: 'ci', release: 'patch' },
          // { type: 'chore', release: 'patch' },
          // { type: 'chore', scope: 'deps-dev', release: false },
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
      '@semantic-release/npm',
      {
        pkgRoot: 'dist',
        // Uncomment below to test semantic-release without npm
        // npmPublish: false,
      },
    ],
    // Update the package.json, since @semantic-release/npm only update the package.json in dist
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'npm --no-git-tag-version --allow-same-version version ${nextRelease.version}',
      },
    ],
    [
      'semantic-release-git-branches',
      {
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        branchMerges: ['master', 'develop'],
      },
    ],
    // Uncomment as alternative for git-flow
    // ['@semantic-release/git'],

    // Uncomment to test semantic-release without github actions
    [
      '@semantic-release/github',
      {
        assignees: ['libinvarghese'],
        // assets: [
        //   {
        //     path: 'dist/recursive-copy-cli-*.tgz',
        //     name: 'recursive-copy-cli-${nextRelease.gitTag}.pack.tgz',
        //     label: 'recursive-copy-cli-${nextRelease.gitTag}.pack.tgz',
        //   },
        // ],
      },
    ],
  ],
  preset: 'angular',
};
