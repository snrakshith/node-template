import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  // Specify the root directory for Jest to search for tests.
  roots: ["<rootDir>/src"],

  // The test environment that will be used for testing.
  testEnvironment: "node",

  // Module file extensions for importing modules in the test files.
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Transform files with TypeScript using ts-jest.
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  // Ignore specific files or directories when running tests.
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // Map specific file extensions to corresponding module loaders.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // A list of paths to directories that Jest should use to search for test files.
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],

  // Collect code coverage information.
  collectCoverage: true,

  // The directory where Jest should output its coverage files.
  coverageDirectory: "<rootDir>/coverage",

  // An array of glob patterns indicating a set of files for which coverage information should be collected.
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],

  // Display coverage report in text format.
  coverageReporters: ["text", "lcov"],

  // Automatically clear mock calls and instances between every test.
  clearMocks: true,
};

export default config;
