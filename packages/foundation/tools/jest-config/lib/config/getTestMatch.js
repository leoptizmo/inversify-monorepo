import getProjectRoot from './getProjectRoot.js';

/**
 * @param { !string } testExtension Test extension files
 * @param { !boolean } isTargetingSource True if test are under the source folder
 * @returns { !Array.<string> }
 */
function getTestMatch(testExtension, isTargetingSource) {
  const projectRoot = getProjectRoot(isTargetingSource);

  return [`${projectRoot}/**/*${testExtension}`];
}

export default getTestMatch;
