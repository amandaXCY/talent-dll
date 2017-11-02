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
        new webpack.ProvidePlugin({
            $: 'jQuery',
            jQuery:"jQuery",
            Talent:"Talent",
            _:"@beisen/lodash"

        }),
        new webpack.IgnorePlugin(/^(underscore)$/),
        new webpack.DllPlugin({
            // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
            path: 'dist/manifest.json',
            name: '[name]',
            context: path.resolve(__dirname)
        }),
       

        
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
            talentDll:require("./vender-list.js")
        },
        output: {
            // 与业务代码共用同一份路径的配置表
            path:path.resolve(__dirname, './dist'),
            filename: '[name].dev.js',
            library: '[name]'
        },
        plugins: plugins,
        resolve: {
            modules: ['node_modules'],
            alias:{
                '$': path.resolve(process.cwd(),'./node_modules/@beisen/jquery'),
                'jQuery':path.resolve(process.cwd(),'./node_modules/@beisen/jquery'),
                'talent':path.resolve(process.cwd(),'./node_modules/@beisen/talent-no-require/index.js'),
                'Talent':path.resolve(process.cwd(),'./node_modules/@beisen/talent-no-require/index.js')
                
            },
        },
        module:{
            rules: [{
                test: /\.js?$/,
                include: [path.resolve(process.cwd(), "./node_modules/@beisen/jquery/index.js")],
                use: [{
                  loader: 'expose-loader',
                  options: 'jquery'
                },{
                  loader: 'expose-loader',
                  options: '$'
                }]
            }]
        },
        devtool: isProduction ? "cheap-source-map" : false
    };
};