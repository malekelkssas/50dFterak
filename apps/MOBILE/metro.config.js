const { withNxMetro } = require('@nx/react-native');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const baseConfig = mergeConfig(defaultConfig, {
  cacheVersion: 'BlackWhite',
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],
  },
});

module.exports = (async () => {
  const nxConfig = await withNxMetro(baseConfig, {
    debug: false,
    extensions: [],
    watchFolders: [],
  });

  const restored = mergeConfig(nxConfig, {
    resolver: {
      assetExts: baseConfig.resolver.assetExts,
      sourceExts: baseConfig.resolver.sourceExts,
    },
  });

  return withNativeWind(restored, { input: './global.css' });
})();
