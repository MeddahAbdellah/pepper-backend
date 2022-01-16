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
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/src/**/*.test.ts",
  ],
  modulePaths: ["<rootDir>/src"],
  testTimeout: 25000,
  coverageDirectory: 'coverage',
  collectCoverage: false,
};
