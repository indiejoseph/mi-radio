module.exports = function (router) {
  router
    .route('/')
    .get((req, res, next) => {
      res.end('Welcome');
    });
};
