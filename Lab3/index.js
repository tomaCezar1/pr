const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = 3000;
const HOST = 'localhost';
const API_SERVICE_URL = 'https://jsonplaceholder.typicode.com';

// facem logare la fiecare request
app.use(morgan('dev'));

app.get('/test', (req, res, next) => {
  res.send('test');
});

// authorization
app.use('', (req, res, next) => {
  if (req.headers.authorization) {
    next();
  } else {
    res.sendStatus(403);
  }
});

// proxy endpoint
app.use(
  '/json_placeholder',
  createProxyMiddleware('/', {
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      // regex that will overwrite all existing urls to API_SERVICE_URL
      [`^/json_placeholder`]: '', // localhost:3000/json_placeholder/posts/1, the URL will be rewritten to <API_SERVICE_URL>/posts/1
    },
  })
);

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
