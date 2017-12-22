const path                     = require('path');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const DefinePlugin             = require('webpack/lib/DefinePlugin');

const ENV  = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const metadata = {
  env : ENV,
  host: HOST,
  port: PORT
};

module.exports = {
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.css$/,  loader: 'raw-loader', exclude: /node_modules/},
      {test: /\.css$/,  loader: 'style-loader!css?-minimize', exclude: /src/},
      {test: /\.html$/, loader: 'raw-loader'},
      {test: /\.ts$/,   loaders: [
        {loader: 'ts-loader', query: {compilerOptions: {noEmit: false}}}
      ]}
    ]
  },
  plugins: [
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.env)}}),
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      path.join(__dirname, 'src') // location of your src
    )
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
};
