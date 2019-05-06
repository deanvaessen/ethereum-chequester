const path = require( "path" );
const webpack = require( "webpack" );
const merge = require( "webpack-merge" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const WebpackCleanupPlugin = require( "webpack-cleanup-plugin" );
const UglifyJsPlugin = require( "uglifyjs-webpack-plugin" );
const OptimizeCSSAssetsPlugin = require( "optimize-css-assets-webpack-plugin" );
const webpackBase = require( "./webpack.base.js" );

const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );

const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );

module.exports = merge( webpackBase, {
    mode : "production",
    plugins : [
        new webpack.DefinePlugin( {
            "process.env.NODE_ENV" : "\"prod\""
        } ),

        new MiniCssExtractPlugin( {
            filename : "style.css",
            //filename : "[name].css",
            chunkFilename : "[id].css"
        } ),

        new HtmlWebpackPlugin( {
            inject : "body",
            template : path.resolve( __dirname, "../src/index.html" ),
            minify : {
                caseSensitive : true,
                collapseWhitespace : true
            }
        } ),
        new WebpackCleanupPlugin( { exclude : [ "index.html" ] } ),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new UnminifiedWebpackPlugin()
        //new ExtractTextPlugin( "style.css" )
    ],
    optimization : {
        minimizer : [
            new UglifyJsPlugin( {
                cache : true,
                parallel : true,
                uglifyOptions : {
                    compress : true,
                    ecma : 6,
                    mangle : true
                },
                sourceMap : true
            } ),
            new OptimizeCSSAssetsPlugin( {} )
        ]
    }
} );
