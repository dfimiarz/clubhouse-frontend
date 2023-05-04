//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    //plugins: [ new BundleAnalyzerPlugin() ]
  },
  devServer: {
    allowedHosts: ["localhost", "clubhouse.test", "www.clubhouse.test"],
    host: "www.clubhouse.test",
    port: 8080,
  },
});
