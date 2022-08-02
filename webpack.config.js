const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const output = (dev) => {
  const result = {
    path: dev ? path.resolve('build') : path.resolve('dist'),
    filename: dev ? '[name].[contenthash].js' : 'index.js',
  }
  if (!dev) result.libraryTarget = 'commonjs2'
  return result
}

const plugins = (dev) => {
  const plug = []
  if (dev)
    plug.push(
      new HTMLWebpackPlugin({
        template: './dev/index.html',
      })
    )
  else plug.push(new CleanWebpackPlugin())
  plug.push(
    new MiniCssExtractPlugin({
      filename: dev ? '[name].[contenthash].css' : 'index.css',
      chunkFilename: '[id].css',
    })
  )
  return plug
}

const optimization = (dev) => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  }

  if (!dev)
    config.minimizer = [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new TerserPlugin(),
    ]

  return config
}

module.exports = (env) => {
  const isDev = env.dev

  console.log(`mode: ${isDev ? 'development' : 'production'}`)

  const result = {
    mode: isDev ? 'development' : 'production',
    entry: isDev ? './dev/index.tsx' : './src/index.ts',
    output: output(isDev),
    plugins: plugins(isDev),
    //optimization: optimization(),
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: isDev ? 'tsconfig.dev.json' : 'tsconfig.json',
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            //'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|svg|gif)$/,
          type: 'asset',
        },
        {
          test: /\.(frag|vert)$/i,
          type: 'asset/source',
        },
      ],
    },
    resolve: {
      extensions: ['...', '.ts', '.tsx'],
      alias: {
        react: path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        '@components': path.resolve(__dirname, './src/components/'),
        '@utils': path.resolve(__dirname, './src/utils/'),
      },
    },
  }
  if (!isDev) {
    result.externals = {
      // Don't bundle react or react-dom
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'ReactDOM',
        root: 'ReactDOM',
      },
    }
  } else {
    //result.optimization = optimization()
    result.devtool = 'source-map'
    result.devServer = { port: 3000 }
    /*result.externals = {
      react: 'React',
      'react-dom': 'ReactDOM',
    }*/
  }

  //console.log(JSON.stringify(result, null, 2))
  return result
}
