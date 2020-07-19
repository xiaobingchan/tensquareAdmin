'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.207.131:7300/mock/5c0b42c85b4c7508d4dc568c/1024"'
  BASE_API: '"http://127.0.0.1:10020"' // 管理员网关
})
