import getProjectRoot from './getProjectRoot.js';

/**
 * @param { !string } projectName Jest project's name
 * @param { !boolean } isTargetingSource True if test are under the source folder
 * @param { !Array<string> } testMatch Expressions to match to test file paths
 * @param { !Array<string> } testPathIgnorePatterns Expressions to match to ignored file paths by jest
 * @returns { !import("@jest/types").Config.InitialProjectOptions } Jest config
 */
function getJestProjectConfig(
  projectName,
  isTargetingSource,
  testMatch,
  testPathIgnorePatterns,
) {
  /** @type { !import("@jest/types").Config.InitialProjectOptions } */
  const projectConfig = {
    coveragePathIgnorePatterns: ['/fixtures/', '/node_modules/'],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    displayName: projectName,
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: '.',
    roots: [getProjectRoot(isTargetingSource)],
    testEnvironment: 'node',
    testMatch: testMatch,
    testPathIgnorePatterns: testPathIgnorePatterns,
  };

  return projectConfig;
}

export default getJestProjectConfig;
