
const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.resolve.alias.set("crypto", require.resolve("crypto-browserify"));
    config.resolve.alias.set("stream", require.resolve("stream-browserify"));
    config.module.rule('wasm').test(/\.wasm$/).use('wasm-loader')
        .loader('wasm-loader')
        .end();
  },
});

