//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: "source-map",
  },
  devServer: {
    host: "www.clubhouse.test",
    port: 8081,
    allowedHosts: [".clubhouse.test"],
  },
});
