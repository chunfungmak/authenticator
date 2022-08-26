const webpack = require('webpack')

const {override, addWebpackPlugin, addWebpackResolve, addLessLoader} = require("customize-cra");
const AntDesignThemePlugin = require("antd-theme-webpack-plugin");
const {getLessVars} = require("antd-theme-generator");
const path = require("path");
const fs = require("fs");

const themeVariables = getLessVars(
    path.join(__dirname, "./src/styles/variables.less")
);
const darkVars = getLessVars("./node_modules/antd/lib/style/themes/dark.less")
const lightVars = getLessVars("./node_modules/antd/lib/style/themes/compact.less")
fs.writeFileSync("./src/themes/dark.json", JSON.stringify(darkVars));
fs.writeFileSync("./src/themes/light.json", JSON.stringify(lightVars));
fs.writeFileSync("./src/themes/themes.json", JSON.stringify(themeVariables));
const options = {
    stylesDir: path.join(__dirname, "./src/styles"),
    // antDir: path.join(__dirname, "./node_modules/antd"),
    // 需更換 themes 的變數
    themeVariables: Array.from(
        new Set([
            ...Object.keys(darkVars),
            ...Object.keys(lightVars),
            ...Object.keys(themeVariables),
        ])
    ),
    generateOnce: false
};

module.exports = override(
    addWebpackPlugin(new AntDesignThemePlugin(options)),
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
        },
    }),
    addWebpackPlugin(new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
    })),
    addWebpackResolve({
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "buffer": require.resolve("buffer/")
        }
    })
);

