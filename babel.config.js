module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // plugins: ['react-native-reanimated/plugin'], // Temporariamente desabilitado devido a erro
  };
};
