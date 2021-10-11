const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const CopyPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const packageJSON = require('./package.json')

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

// dll vendor related.
let dllFileName
if (process.env.NODE_ENV === 'production') {
  const assetsPath = path.resolve(__dirname, './src/assets/dll/assets.json')
  const depsPath = path.resolve(__dirname, './src/assets/dll/vendor-version.json')
  if (!fs.existsSync(assetsPath) || !fs.existsSync(depsPath)) {
    throw new Error('dll related files not exist, you need first build dll vendor. See README.md for more details.')
  }
  dllFileName = require(assetsPath).vendor.js

  const depsJSON = require(depsPath)
  Object.keys(depsJSON).forEach((key) => {
    if (depsJSON[key] !== packageJSON.dependencies[key]) throw new Error('dll vendor outdated. re-run "build:dll".')
  })
}

// webpack config
module.exports = function (defaultConfig, webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  const config = merge(defaultConfig, {
    plugins: [
      isEnvProduction && new webpack.HashedModuleIdsPlugin(),

      isEnvProduction &&
        new webpack.DllReferencePlugin({
          manifest: require(path.resolve(__dirname, './src/assets/dll/vendor-manifest.json')),
        }),

      isEnvProduction &&
        new CopyPlugin({
          patterns: [{ from: './src/assets/dll/' + dllFileName, to: './static/js' }],
        }),

      new LodashModuleReplacementPlugin(),

      process.argv[2] === 'analyze' && new BundleAnalyzerPlugin(),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.join(path.resolve(__dirname), './src'),
      },
    },
  })

  // module rule list
  const oneOfList = config.module.rules.find((rule) => rule.oneOf).oneOf

  // less and less module support.
  const cssModuleLoaders = [...oneOfList.find((rule) => String(rule.test) === String(/\.module\.css$/)).use]
  const cssLoader = { ...cssModuleLoaders[1] } // css-loader
  cssLoader.options = {
    ...cssLoader.options,
    importLoaders: 2,
    modules: { ...cssLoader.options.modules, auto: /\.module\.less/ },
  }
  cssModuleLoaders[1] = cssLoader // replace css-loader
  oneOfList.unshift({
    test: /\.less$/,
    use: [
      ...cssModuleLoaders,
      {
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            modifyVars: { 'primary-color': '#ff8200' },
            javascriptEnabled: true,
          },
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ],
    sideEffects: true,
  })

  // Babel configuration
  const babelLoader = oneOfList.find((rule) => rule.include && rule.loader && rule.loader.includes('babel-loader'))
  const babelOptions = babelLoader.options

  // Dynamic Imports (Code splitting)
  babelOptions.plugins.push(require.resolve('@babel/plugin-syntax-dynamic-import'))

  // Modular import 'antd'
  babelOptions.plugins.push([
    require.resolve('babel-plugin-import'),
    { libraryName: 'antd', libraryDirectory: 'es', style: true },
  ])

  // Lodash tree shaking
  babelOptions.plugins.push([require.resolve('babel-plugin-lodash')])

  // htmlWebpackPlugin instance, adding filename as property, and trying to use it in index.html.
  if (isEnvProduction) {
    const htmlWebpackPlugin = config.plugins.find((plugin) => plugin.constructor.name === 'HtmlWebpackPlugin')
    htmlWebpackPlugin.options.dllVendor = '/static/js/' + dllFileName
  }

  return config
}
