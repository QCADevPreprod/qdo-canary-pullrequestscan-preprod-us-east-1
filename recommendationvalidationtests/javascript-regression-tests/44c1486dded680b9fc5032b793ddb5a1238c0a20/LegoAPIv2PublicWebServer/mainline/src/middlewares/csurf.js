const csrf = require('csurf');

const csurfMiddleware = csrf({
  cookie: {
    key: 'lego-pws.crsf',
    httpOnly: true,
    secure: false,
    signed: true,
  }
});

module.exports = (req, res, next) => {
  return csurfMiddleware(req, res, next);
};