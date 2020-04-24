/*= =========react 相关========= */
const ip = require('ip').address();

const PORT = 9901;
let cookie;
// 本地开发访问测试api 地址 ，必须http开头， // 开头代理不过
const API_DOMAIN = 'http://api.demo.com/';

module.exports = {
  port: PORT,
  // domain: `//${ip}:${PORT}/`, // 替换后域名
  domain: './', // 替换后域名
  apiDomain: API_DOMAIN,
  proxy: {
    '/api': {
      target: 'http://api.demo.com',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '/api',
      },
    },
  },
};
