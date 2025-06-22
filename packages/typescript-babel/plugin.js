Plugin.registerCompiler({
  extensions: ["d.ts"],
}, () => ({
    processFilesForTarget() {
      // NOTE: Ignore `d.ts` files.
    }
  })
);

Plugin.registerCompiler({
  extensions: ["ts"],
}, () => new BabelCompiler({
    react: false,
  }, (babelOptions, file) => {
    babelOptions.plugins = [
      [
        file.require('@babel/plugin-transform-typescript'),
        {isTSX: false}
      ],
      ...(babelOptions.plugins || []),
    ];
  })
);

Plugin.registerCompiler({
  extensions: ["tsx"],
}, () => new BabelCompiler({
    react: true,
  }, (babelOptions, file) => {
    babelOptions.plugins = [
      [
        file.require('@babel/plugin-transform-typescript'),
        {isTSX: true}
      ],
      ...(babelOptions.plugins || []),
      ...(file.hmrAvailable() ? ReactFastRefresh.getBabelPluginConfig() : []),
    ];
  })
);
