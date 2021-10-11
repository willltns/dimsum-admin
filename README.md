### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Before run `npm run build`, Please see dll-related information below first.<br>

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.<br />

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://create-react-app.dev/docs/deployment/) for more information.

### Packing stable libs in one chunk. (dll vendor) (dllPlugin & dllReferencePlugin)
If you do not need dll vendor chunk, you should delete dll-related configuration in file `webpack.rewire.js`,
delete file `./src/utils/webpack.dll.js`, delete `build:dll` script in `package.json`,and remove related packages.

**NOTICE!!**, if you update any dll-packed package version, do not forget to re-run `build:dll` script.

### Code Formatting
`prettier` is initially supported. if shortcut not valid, please check your IDE setting.

When executing `git commit`, it would automatically format your changed/staged files.

### Resolve Aliases In WebStorm.
`Command + left click` the module path does not navigate to the right file in WebStorm? 
try [coding assistance](https://www.jetbrains.com/help/webstorm/2020.3/using-webpack.html)

### Customizing Environment Variables for Arbitrary Build Environments
You can create an arbitrary build environment by creating a custom .env file and loading it using [env-cmd](https://www.npmjs.com/package/env-cmd). <br/>
[https://create-react-app.dev/docs/deployment/#customizing-environment-variables-for-arbitrary-build-environments](https://create-react-app.dev/docs/deployment/#customizing-environment-variables-for-arbitrary-build-environments)

### Adding Custom Environment Variables
`.env`. `.env.development`. `.env.production` ...

[https://create-react-app.dev/docs/adding-custom-environment-variables/](https://create-react-app.dev/docs/adding-custom-environment-variables/). <br/>
[https://create-react-app.dev/docs/advanced-configuration/](https://create-react-app.dev/docs/advanced-configuration/).

### Analyzing the bundle size. (Visualizing)
1. webpack-bundle-analyzer
    - `yarn bulid analyze` or `npm run build analyze`
2. Or the official recommended way --> [Analyzing the Bundle Size](https://create-react-app.dev/docs/analyzing-the-bundle-size/)

### ant-design
`yarn add antd` or `npm install antd --save`.
- Modularized antd
    1. `yarn add babel-plugin-import` or `npm install babel-plugin-import --save`.
    2. In `webpack.rewire.js`, uncomment below code in `webpack.rewire.js`:
  ```javascript
  babelOptions.plugins.push([
    require.resolve('babel-plugin-import'),
    { libraryName: 'antd', libraryDirectory: 'es', style: true },
  ])
  ```
- [antd Customizing Theme](https://ant.design/docs/react/customize-theme-cn), `less-loader` -> `modifyVars`
  - Customizing theme require `less` support, first installing related dependencies: `less`, `less-loader`,
    and uncommenting code related to `less` configuration in `webpack.rewire.js`

### lodash
`yarn add lodash` or `npm install lodash --save`.

Recommend importing function through full module path, eg： `import debounce from 'lodash/debounce'`.

##### lodash tree shaking
1. Install related dependencies.
   ```sh
   $ npm install lodash-webpack-plugin babel-plugin-lodash --save
   $ # or
   $ yarn add lodash-webpack-plugin babel-plugin-lodash
   ```
2. In `webpack.rewire.js` file, trying to add the following code in the right place:
   ```javascript
   // merged this plugin into webpack's property `plugins`.
   const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
   new LodashModuleReplacementPlugin()

   babelOptions.plugins.push([require.resolve('babel-plugin-lodash')])
   ```
