const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  target: "node",
  entry: "./src/extension.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../../[resource-path]",
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode",
    "uglify-js": "commonjs uglify-js", // Pug relies on uglify-js, which doesn't play nice with Webpack. Fortunately we don't need it, so we exclude it from the bundle
    "aws-sdk": "commonjs aws-sdk", // This comes from the Sass dependency, and is an optional dependency that we don't need
    fsevents: "commonjs fsevents", // This comes from the SaaS dependency, but is a native module and therefore can't be webpacked
    "@microsoft/typescript-etw": "commonjs @microsoft/typescript-etw",
    "velocityjs": "commonjs velocityjs", // The following come from @vue/component-compiler-utils
    "dustjs-linkedin": "commonjs dustjs-linkedin",
    "atpl": "commonjs atpl",
    "liquor": "commonjs liquor",
    "twig": "commonjs twig",
    "ejs": "commonjs ejs",
    "eco": "commonjs eco",
    "jazz": "commonjs jazz",
    "jqtpl": "commonjs jqtpl",
    "hamljs": "commonjs hamljs",
    "hamlet": "commonjs hamlet",
    "whiskers": "commonjs whiskers",
    "haml-coffee": "commonjs haml-coffee",
    "hogan.js": "commonjs hogan.js",
    "templayed": "commonjs templayed",
    "handlebars": "commonjs handlebars",
    "walrus": "commonjs walrus",
    "mustache": "commonjs mustache",
    "just": "commonjs just",
    "ect": "commonjs ect",
    "mote": "commonjs mote",
    "toffee": "commonjs toffee",
    "dot": "commonjs dot",
    "bracket-template": "commonjs bracket-template",
    "ractive": "commonjs ractive",
    "htmling": "commonjs htmling",
    "babel-core": "commonjs babel-core",
    "plates": "commonjs plates",
    "react-dom/server": "commonjs react-dom",
    "react": "commonjs react",
    "vash": "commonjs vash",
    "slm": "commonjs slm",
    "marko": "commonjs marko",
    "teacup/lib/express": "commonjs teacup",
    "coffee-script": "commonjs coffee-script",
    "./lib-cov/stylus": "commonjs stylus",
    "vue": "commonjs vue"
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  node: {
    __filename: false,
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      test: /\.ts$/,
      noSources: false,
      module: true,
      columns: true,
    }),
  ],
};
