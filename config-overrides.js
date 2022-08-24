const webpack = require('webpack')
const { getThemeVariables } = require('antd/dist/theme');

module.exports = function override (config, env) {

    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        })
    ]

    config.resolve.fallback = {
       ...config.resolve.fallback,
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "buffer": require.resolve("buffer/")
    }

    config.module.rules= [
        ...config.module.rules,
        // {
        //     loader: 'less-loader', // compiles Less to CSS
        //      options: {
        //      lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
        //            modifyVars: getThemeVariables({
        //                   dark: true, // 开启暗黑模式
        //                    compact: true, // 开启紧凑模式
        //                 }),
        //             javascriptEnabled: true,
        //      },
        //    },
// }
    ]

    return config
}
