const path = require( "path" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const ExtractTextPlugin = require( "extract-text-webpack-plugin" );

const extractSass = new ExtractTextPlugin( {
    filename : "[name].css"
} );

const webpack = require( "webpack" );
const fs = require( "fs" );
process.noDeprecation = true;

module.exports = {
    entry : {
        app : [ "@babel/polyfill", path.resolve( __dirname, "../src/" ) ]
    },

    output : {
        path : path.resolve( __dirname, "../build" ),
        publicPath : "",
        filename : "bundle.js",
        sourceMapFilename : "bundle.js.map",
        chunkFilename : "[id].[chunkhash].js"
    },
    plugins : [
        new webpack.ProvidePlugin( {
            $ : "jquery",
            jquery : "jQuery",
            jQuery : "jquery",
            "window.jQuery" : "jquery"
        } ),
        new ExtractTextPlugin( "style.css" ),
        new webpack.ProvidePlugin( {
            React : "react"
        } )
    ],
    externals : {},

    resolve : {
        extensions : [ "*", ".js", ".html" ],
        modules : [ path.join( __dirname, "../node_modules" ) ],
        alias : {
            src : path.resolve( __dirname, "../src" )
            //assets : path.resolve( __dirname, "../src/assets" )
        }
    },

    module : {
        rules : [
            {
                test : /\.jsx?$/,
                include : [ path.resolve( __dirname, "../src" ) ],
                use : [
                    {
                        loader : "babel-loader",
                        options : {
                            ...JSON.parse( fs.readFileSync( path.resolve( __dirname, "../.babelrc" ) ) ),
                            cacheDirectory : true
                        }
                    }
                ]
            },
            {
                test : /\.css$/,
                use : ExtractTextPlugin.extract( {
                    fallback : "style-loader",
                    use : [
                        {
                            loader : "css-loader",
                            options : {
                                modules : false
                            }
                        }
                    ]
                } )
            },
            {
                test : /\.s[ac]ss$/,
                use : ExtractTextPlugin.extract( {
                    fallback : "style-loader",
                    use : [
                        {
                            loader : "css-loader",
                            options : {
                                modules : false
                            }
                        },
                        //"postcss-loader",
                        "sass-loader"
                    ]
                } )
            },
            /*
            {
                test : /\.css$/,
                use : [
                    {
                        loader : MiniCssExtractPlugin.loader,
                        options : {
                            //publicPath : "../"
                        }
                    },
                    "css-loader"
                ]
            },
            {
                test : /\.(sa|sc|c)ss$/,
                use : [
                    MiniCssExtractPlugin.loader, //devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",

                    //{
                    //    loader : "postcss-loader",
                    //    options : {
                    //        //publicPath : "../"
                    //    }
                    //},
                    "sass-loader"
                ]
            },
            */

            /*
            {
                test : /\.css$/,
                use : [
                    {
                        loader : MiniCssExtractPlugin.loader,
                        options : {
                            //publicPath : "../"
                        }
                    },
                    "css-loader"
                ]
            },
            {
                test : /\.css$/,
                use : MiniCssExtractPlugin.extract( {
                    fallback : "style-loader",
                    use : [
                        {
                            loader : "css-loader",
                            options : {
                                modules : false
                            }
                        }
                    ]
                } )
            },

            {
                test : /\.s[ac]ss$/,
                use : MiniCssExtractPlugin.extract( {
                    fallback : "style-loader",
                    use : [
                        {
                            loader : "css-loader",
                            options : {
                                modules : false
                            }
                        },
                        "postcss-loader",
                        "sass-loader"
                    ]
                } )
            },
            */
            {
                test : /\.(png|jpe?g|gif|ico)$/,
                use : [ "file-loader?name=assets/[name].[ext]" ]
            },
            {
                test : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use : [ "url-loader?limit=10000&mimetype=application/font-woff" ]
            },
            {
                test : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use : [ "file-loader" ]
            }
        ]
    }
};
