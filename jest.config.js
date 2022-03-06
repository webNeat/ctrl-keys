module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: './coverage',
  coverageReporters: ['lcov'],
  testPathIgnorePatterns: ['/node_modules/', '/benchmarks/', '/tmp/'],
}
