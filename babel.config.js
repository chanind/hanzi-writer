module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: '>2%',
          node: '12',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
};
