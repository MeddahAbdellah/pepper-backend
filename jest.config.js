module.exports = {
  testEnvironment: 'node',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  verbose: true,
  maxWorkers: 1,
  forceExit: true,
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/src/**/*.test.ts",
    "<rootDir>/src/**/*.spec.ts",
  ],
  modulePaths: ["<rootDir>/src"],
  testTimeout: 25000,
  coverageDirectory: 'coverage',
  collectCoverage: false,
};
