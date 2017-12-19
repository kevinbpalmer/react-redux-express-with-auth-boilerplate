const rewireLess = require('react-app-rewire-less')
const {injectBabelPlugin} = require('react-app-rewired')

module.exports = function override(config, env) {
  config = injectBabelPlugin([
    'import', {
      libraryName: 'antd',
      style: true
    }
  ], config); // change importing css to less
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      "@primary-color": "#9E1B32",
      "@menu-dark-bg": "#9E1B32"
    }
  })(config, env);

  return config;
};
