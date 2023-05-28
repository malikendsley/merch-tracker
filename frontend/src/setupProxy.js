const { createProxyMiddleware } = require('http-proxy-middleware');

const backendUrl = process.env.REACT_APP_BACKEND_URL;
console.log('backendUrl: ', backendUrl);
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    })
  );
};