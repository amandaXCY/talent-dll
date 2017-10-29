const path = require("path");
const webpack = require("webpack");
const dev = "development";
const prod = "production";
const {
    NODE_ENV = dev,
    npm_package_version = "",
    npm_package_name = ""
} = process.env;
const isProduction = NODE_ENV === prod;
// const { manifest, filename } = require("@talentui/dll-naming")(
//     npm_package_name,
//     npm_package_version,
//     isProduction
// );

//变量名称中不能有减号，所以把-号换成下划线
//const outputVarName = npm_package_name.split(/@|\/|\-|\./).join("_");

//const DllParser = require("@talentui/dll-parser");
/**
 * @options
 * root: 项目根目录
 * venders: vender列表
 */

module.exports = (options = {}) => {
    //const targetDir = path.resolve(options.root, "dist/");
    let plugins = [
        // new webpack.DefinePlugin({
        //     "process.env": {
        //         NODE_ENV: JSON.stringify(isProduction ? prod : dev)
        //     }
        // }),
        // // new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DllPlugin({
            path: 'dist/manifest.json',
            name: '[name]',
            context: __dirname
        }),
        new webpack.IgnorePlugin(/^(underscore)$/)
    ];

    if (isProduction) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true
            })
        );
    }else{
        //当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
        plugins.push(new webpack.NamedModulesPlugin());
    }

    return {
        entry: {
            talent:require("./vender-list.js")
        },
        output: {
            path: path.resolve(__dirname,'./dist'),
            filename: '[name].js',
            library: '[name]'
        },
        plugins: plugins,
        resolve: {
            modules: ['node_modules'],
        },
        devtool: isProduction ? "cheap-source-map" : false
    };
};