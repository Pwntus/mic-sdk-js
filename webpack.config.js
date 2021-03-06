const TerserPlugin = require('terser-webpack-plugin'),
      CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'mic-sdk-js': './src/index.ts',
    'mic-sdk-js.min': './src/index.ts'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    library: 'MIC',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  // Needed for AWS IoT to work in browser
  node: {
    fs: 'empty',
    tls: 'empty'
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js']
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6
        }
      })
    ]
  },
  plugins: [
    new CompressionPlugin({
      include: /\.min\.js$/
    })
  ],
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { 
        test: /\.tsx?$/, 
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        query: {
          declaration: false
        }
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-2']
        }
      }
    ]
  }
};
