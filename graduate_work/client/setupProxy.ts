// import { createProxyMiddleware } = require('http-proxy-middleware');
// import { createProxyMiddleware } from 'http-proxy-middleware';

// module.exports = (app) => {
//   app.use(
//     '/api',
//     createProxyMiddleware({
//       target: 'http://192.168.0.101:8000',
//       changeOrigin: true,
//       secure: false,
//     })
//   );

//   app.use((req, res, next) => {
//     console.log(`req TEST TEST`, req);
//     next();
//   })
// };