module.exports = {
  // eslint-disable-next-line no-template-curly-in-string
  tagFormat: 'v${version}',
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main'
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          {
            type: 'refactor',
            release: 'patch',
          },
          {
            type: 'chore',
            release: 'patch',
          },
          {
            type: 'style',
            release: 'patch',
          },
          {
            type: 'fix',
            release: 'patch',
          },
          {
            type: 'feat',
            release: 'minor',
          },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'npm-shrinkwrap.json'],
        // eslint-disable-next-line no-template-curly-in-string
        message: 'chore(release): ${nextRelease.version}',
      },
    ],
  ],
};
