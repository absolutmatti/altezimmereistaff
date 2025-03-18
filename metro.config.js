const { getDefaultConfig } = require('@react-native/metro-config');

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = getDefaultConfig(__dirname);

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  
  const { transformer, resolver } = config;
  
  // Füge .cjs zu den unterstützten Dateierweiterungen hinzu
  resolver.sourceExts = [...resolver.sourceExts, 'cjs'];
  
  // Konfiguration für React Native Reanimated
  transformer.getTransformOptions = async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  });
  
  return config;
})();