const webpack = require("webpack");
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    bundle: "./src/index.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: devMode ? "[name].[hash].js" : "[name].[chunkhash].js"
    // publicPath: 'dist/'
  },
  devServer: {
    contentBase: "dist", // everything will be served from dist
    overlay: true, // if an error occurs with syntax it will overlay the issue in the browser
    port: 6500,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader" // transpile from ES6 to Vanila JS for Browsers
          }
        ],
        exclude: /node_modules/
      },
      {
        test: [/.css$|.scss$/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/",
              hmr: process.env.NODE_ENV === "development"
            }
          },
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 40000,
              outputPath: "assets"
            }
          },
          {
            loader: "image-webpack-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? "styles.[chunkhash].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      publicUrl: process.env.npm_package_homepage
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyPlugin([{ from: "public", to: "./" }]),
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin(), new OptimizeCssAssetsPlugin()],
    splitChunks: {
      chunks: "all",
      name: "vendor"
    }
  }
};
