module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // ⬅️ DEVE SER O ÚLTIMO
    ],
  }; // ⬅️ esse é o que estava faltando fechar
};
