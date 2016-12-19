const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router(); // eslint-disable-line

module.exports = function () {
  const app = express();

  // middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    console.log(req.url);
    next();
  });

  // register router
  require('./routes')(router);
  app.use('/', router);

  return app;
};
