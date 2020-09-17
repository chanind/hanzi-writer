const webpack = require("webpack");

module.exports = {
  options: {
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          query: {
            presets: ["env"],
          },
        },
        {
          test: /\.js$/,
          loader: "eslint-loader",
          exclude: [/node_modules/],
          options: {
            configFile: ".eslintrc",
          },
        },
      ],
    },
    plugins: [
      new webpack.BannerPlugin(
        `Hanzi Writer v${pkg.version}\nhttps://chanind.github.io/hanzi-writer`,
      ),
    ],
  },

  dist: {
    entry: "./src/HanziWriter.js",
    output: {
      filename: "dist/hanzi-writer.js",
      library: "HanziWriter",
      libraryTarget: "umd",
    },
  },
};
