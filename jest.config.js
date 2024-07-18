module.exports = {
  transform: { '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['<rootDir>/src/tests/setupJest.js'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
};