// 本文件用于 webstorm - alias resolve 功能，方便开发
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      '@': path.join(path.resolve(__dirname), './src'),
    },
  },
}