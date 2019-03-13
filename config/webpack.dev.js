const path = require( "path" );
const webpack = require( "webpack" );
const merge = require( "webpack-merge" );
const BrowserSyncPlugin = require( "browser-sync-webpack-plugin" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const config = require( "../config/app.json" );
const webpackBase = require( "./webpack.base.js" );
const HOST = "0.0.0.0";
const { WEBPACK_PORT } = config;

module.exports = merge( webpackBase, {
    devtool : "#eval-source-map",
    mode : "development",

    devServer : {
        historyApiFallback : true,
        watchOptions : { aggregateTimeout : 300, poll : 1000 },
        headers : {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers" : "X-Requested-With, content-type, Authorization"
        },
        proxy : {
            "/api" : "http://localhost:4001"
        }
    },

    plugins : [
        new BrowserSyncPlugin( {
            host : HOST,
            port : WEBPACK_PORT,
            // Proxy the default webpack dev-server port
            proxy : `http://${HOST}:${config.WEBPACK_PORT}/`,
            notify : false,
            open : false,
            // Let webpack handle the reload
            codeSync : false
        } ),

        new webpack.DefinePlugin( {
            "process.env.NODE_ENV" : "\"dev\""
        } ),

        new HtmlWebpackPlugin( {
            inject : "body",
            template : path.resolve( __dirname, "../src/index.html" )
        } ),

        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
        /*
        new MiniCssExtractPlugin( {
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename : "style.css"
        } )
        //new ExtractTextPlugin( "style.css" )
        */
    ],

    optimization : {
        namedModules : true, // NamedModulesPlugin()
        splitChunks : {
            // CommonsChunkPlugin()
            name : "vendor",
            minChunks : 2
        },
        noEmitOnErrors : true, // NoEmitOnErrorsPlugin
        concatenateModules : true //ModuleConcatenationPlugin
    }
} );
