// ts-check

/**
 * builds webpack config
 * @param {!string} outputPath output path
 * @returns {!import("webpack").Configuration}
 */
export default function buildWebpackConfig(outputPath) {
  return {
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    experiments: {
      outputModule: true,
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.esm.json',
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'index.js',
      library: {
        type: 'module',
      },
      path: outputPath,
    },
    stats: 'verbose',
  };
}
