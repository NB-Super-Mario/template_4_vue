const path = require('path');
const config = require('config');

const tsImportPluginFactory = require('ts-import-plugin');
const pkg = require('./package.json');

const domain = config.get('domain');
const proxy = config.get('proxy');
const port = config.get('port');

function camel2Dash(_str) {
  const str = _str[0].toLowerCase() + _str.substr(1);
  return str.replace(/([A-Z])/g, $1 => `-${$1.toLowerCase()}`);
}

if (['pre', 'prod', 'test', 'test2', 'test3'].includes(process.env.NODE_ENV)) {
  process.env.NODE_ENV = 'production'; // 解决 NODE_ENV=test npm run build ,vue-cli 编译不压缩问题
}

const baseConfig = {};
const devConfig = {
  ...baseConfig,
  lintOnSave: true,
  devServer: {
    proxy,
    port,
    disableHostCheck: true,
  },
};
const prodConfig = {
  ...baseConfig,
  lintOnSave: false,
  publicPath: `${domain}`,
  assetsDir: 'static', // 静态文件html 除外存放位置
  outputDir: `target/${pkg.name}/`,
};

const conf = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    /* resolve: {
      alias: {
        vue$: path.resolve(process.cwd(), 'node_modules/vue/dist/vue.js')
      }
    } */
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      vuex: 'Vuex',
    },
  },
  chainWebpack(chainConf) {
    /* chainConf.module
      .rule('ts')
      .use('ts-loader')
      .tap(args => {
        args.getCustomTransformers = () => ({
          before: [
            tsImportPluginFactory([
              {
                libraryName: 'element-ui',
                libraryDirectory: 'lib',
                camel2DashComponentName: true,
                style: pathName => {
                  const localStyle = path.join(
                    'element-ui',
                    'lib',
                    'theme-chalk',
                    `${camel2Dash(path.basename(pathName, '.js'))}.css`
                  );
                  // console.log(localStyle);
                  return localStyle;
                },
              },
            ]),
          ],
        });

        return args;
      }); */
    // https://github.com/ktsn/vue-template-loader/issues/52
    chainConf.module
      .rule('html')
      .test(/\.html$/)
      .exclude.add(/index\.html/)
      .end()
      .use('lvue-template-loader')
      .loader('vue-template-loader')
      .options({
        transformAssetUrls: {
          // The key should be an element name
          // The value should be an attribute name or an array of attribute names
          img: 'src',
        },
      })
      .end();
  },
  ...conf,
};
