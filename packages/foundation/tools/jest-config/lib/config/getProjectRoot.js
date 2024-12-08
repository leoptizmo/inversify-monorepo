const projectRoot = '<rootDir>';

/**
 * @param { !boolean } isTargetingSource True if test are under the source folder
 * @returns {!string } Project root path
 */
export default function getProjectRoot(isTargetingSource) {
  if (isTargetingSource) {
    return `${projectRoot}/src`;
  } else {
    return `${projectRoot}/lib/cjs`;
  }
}
