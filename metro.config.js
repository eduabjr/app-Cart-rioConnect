/**
 * Metro Config - Configuração do Bundler
 * 
 * Configura ofuscação e minificação para builds de produção
 */

const {getDefaultConfig} = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Verificar se está em modo de produção
const isProduction = process.env.NODE_ENV === 'production' || !__DEV__;

// Configuração de minificação/ofuscação para produção
if (isProduction) {
  config.transformer = {
    ...config.transformer,
    minifierPath: require.resolve('metro-minify-terser'),
    minifierConfig: {
      // Configurações de ofuscação
      ecma: 8,
      keep_classnames: false,
      keep_fnames: false,
      mangle: {
        module: true,
        keep_classnames: false,
        keep_fnames: false,
        properties: {
          regex: /^_/,
        },
      },
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
      output: {
        comments: false, // Remove comentários
        ascii_only: false,
      },
    },
  };
}

module.exports = config;

