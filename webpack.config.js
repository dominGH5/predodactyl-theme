const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './resources/scripts/index.tsx',

    output: {
      path: path.resolve(__dirname, 'public/assets'),
      filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      clean: true,
      publicPath: '/',
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'resources/scripts'),
        '@theme': path.resolve(__dirname, 'resources/scripts/components/theme'),
      },
    },

    module: {
      rules: [
        // TypeScript / TSX
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        // CSS (Tailwind + PostCSS)
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './resources/views/index.html',
        filename: '../index.html',
        inject: 'body',
        minify: isProd ? {
          collapseWhitespace: true,
          removeComments: true,
        } : false,
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: 'css/[name].[contenthash:8].css',
            }),
          ]
        : []),
    ],

    optimization: {
      minimizer: [
        '...',
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },

    devServer: {
      static: path.resolve(__dirname, 'public'),
      port: 3000,
      hot: true,
      historyApiFallback: true,
      open: true,
    },

    devtool: isProd ? 'source-map' : 'eval-source-map',

    performance: {
      hints: isProd ? 'warning' : false,
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    },
  };
};
