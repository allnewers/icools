'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // ocr:'/ocr/',
  API_ROOT:'http://192.168.0.200:9898/'
})
