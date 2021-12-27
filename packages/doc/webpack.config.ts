import path from "path";

const config = (_env, { mode }, dev = mode === "development") => ({
  target: "node",
  devtool: dev ? "eval" : "source-map",
  entry: {
    index: require.resolve("./lib"),
  },
  externalsPresets: { node: true },
  externals: [
    require("webpack-node-externals")({
      additionalModuleDirs: ["../../node_modules"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        // https://github.com/kriasoft/isomorphic-style-loader#getting-started
        use: [
          "isomorphic-style-loader",
          {
            loader: "css-loader",
            options: {
              // https://github.com/kriasoft/isomorphic-style-loader/issues/201
              esModule: false,
              importLoaders: 1,
              modules: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                fiber: require("fibers"),
              },
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react", "@babel/preset-typescript"],
        },
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    clean: true,
    library: {
      type: "commonjs2",
    },
    path: path.resolve(__dirname, "lib"),
  },
});

export default config;
