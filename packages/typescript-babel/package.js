Package.describe({
  name: 'typescript-babel',
  version: '3.0.0',
});

Package.registerBuildPlugin({
  name: 'compile-typescript-babel',
  use: ['babel-compiler', 'react-fast-refresh'],
  sources: ['plugin.js'],
});

Package.onUse(function(api) {
  api.use('isobuild:compiler-plugin@1.0.0');
  api.use('babel-compiler');
  api.use('react-fast-refresh');

  // The following api.imply calls should match those in
  // ../ecmascript/package.js.
  api.imply('modules');
  api.imply('ecmascript-runtime');
  api.imply('babel-runtime');
  api.imply('promise');
  // Runtime support for Meteor 1.5 dynamic import(...) syntax.
  api.imply('dynamic-import');
});
