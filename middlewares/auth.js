const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../utils/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  if (!req.headers.cookie) {
    throw next(new UnauthorizedError('Необходима авторизация'));
  }
  const { cookie } = req.headers;
  const token = cookie.replace('jwt=', '');
  const payload = jwt.verify(token, SECRET_KEY);

  req.user = payload;

  next();
};
