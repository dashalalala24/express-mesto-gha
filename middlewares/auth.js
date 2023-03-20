const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../utils/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  if (!req.headers.cookie) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const { cookie } = req.headers;
  const token = cookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch {
    next();
  }
  req.user = payload;

  next();
};
