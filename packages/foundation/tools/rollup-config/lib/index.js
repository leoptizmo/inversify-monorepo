import fs from 'node:fs/promises';
import path from 'node:path';

import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

import pathExists from './utils/pathExists.js';

const PACKAGE_JSON_PATH = './package.json';

if (!pathExists(PACKAGE_JSON_PATH)) {
  throw new Error(`Expected "${PACKAGE_JSON_PATH}" path to exist`);
}

const packageJsonObject = JSON.parse(await fs.readFile(PACKAGE_JSON_PATH));
const packageDependencies = Object.keys(packageJsonObject.dependencies ?? {});
const packagePeerDependencies = Object.keys(
  packageJsonObject.peerDependencies ?? {},
);

/**
 * @param { !string } input
 * @param { !string } output
 * @returns {!import("rollup").MergedRollupOptions[]}
 */
function buildBundleConfig(inputFile, outputDir) {
  const filePath = path.parse(inputFile);

  const declarationFilePath = path.join(
    outputDir,
    `${filePath.name}.d${filePath.ext}`,
  );

  return [
    {
      input: inputFile,
      external: [...packageDependencies, ...packagePeerDependencies],
      output: [
        {
          dir: outputDir,
          format: 'esm',
          sourcemap: true,
          sourcemapPathTransform: (relativeSourcePath) => {
            // Rollup seems to generate source maps pointing to the wrong directory. Ugly patch to fix it
            if (relativeSourcePath.startsWith('../')) {
              return relativeSourcePath.slice(3);
            } else {
              return relativeSourcePath;
            }
          },
        },
      ],
      plugins: [
        typescript({
          tsconfig: './tsconfig.esm.json',
        }),
        terser(),
      ],
    },
    {
      input: declarationFilePath,
      output: [{ file: declarationFilePath, format: 'es' }],
      plugins: [
        dts({
          tsconfig: './tsconfig.esm.json',
        }),
      ],
    },
  ];
}

/** @type {!import("rollup").MergedRollupOptions[]} */
export default buildBundleConfig('./src/index.ts', './lib/esm');
