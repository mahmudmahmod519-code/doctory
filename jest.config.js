// Jest configuration — Doctory backend
// Run: npm test          (all suites)
//      npm run test:unit  (unit only)
//      npm run test:integration
//      npm run test:e2e

module.exports = {
  testEnvironment: 'node',

  // every *.test.js inside the test/ tree is a suite
  testMatch: ['<rootDir>/test/**/*.test.js'],

  // global setup (runs once before all suites) + per-suite setup
  globalSetup: '<rootDir>/test/globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],

  // the test database used by the integration / e2e suites
  globalTeardown: '<rootDir>/test/globalTeardown.js',

  collectCoverageFrom: [
    'routes/**/*.js',
    'logicModels/**/*.js',
    'services/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    'models/**/*.js'
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/', '/ml/'],
  coverageDirectory: '<rootDir>/coverage',

  testTimeout: 30000,
  verbose: true
};
