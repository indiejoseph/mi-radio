const fs = require('fs');
const path = require('path');

module.exports = function (router) {
  fs.readdirSync(path.join(__dirname, './'))
    .filter(file =>
      !/index\.js$/.test(file)
    )
    .forEach(file =>
      require(path.join(__dirname, file))(router)
    );
};
