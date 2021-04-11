
const semver = require('semver')
const execa = require('execa')

const version = require('../lerna.json').version
const distTag = !!semver.prerelease(version) ? 'next' : 'latest'

execa.sync(
  'lerna',
  [
    'publish',
    version,
    '--dist-tag',
    distTag,
    '--force-publish',
    '*'
  ],
  { stdio: 'inherit' }
)
