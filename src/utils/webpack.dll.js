const path = require('path')
const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const dllPath = path.resolve(__dirname, '../assets/dll')

const dllPackages = ['react', 'react-dom', 'react-router-dom']

module.exports = {
  mode: 'production',
  entry: {
    vendor: dllPackages,
  },
  output: {
    path: dllPath,
    filename: '[name].[contenthash:8].js',
    library: '[name]',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(dllPath, '[name]-manifest.json'),
    }),
    new AssetsPlugin({
      filename: 'assets.json',
      path: dllPath,
    }),

    // Generate a file to verify whether the dll is out of date when build project.
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../../package.json'),
          to: path.resolve(dllPath, 'vendor-version.json'),
          transform: (content) => modify(content),
        },
      ],
    }),
  ],
}

function modify(buffer) {
  const packageJson = JSON.parse(buffer.toString())

  const dllDepsJson = dllPackages.reduce((j, p) => {
    j[p] = packageJson.dependencies[p]
    return j
  }, {})

  return JSON.stringify(dllDepsJson, null, 2)
}
