const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  if (!req.headers.cookie) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const { cookie } = req.headers;
  const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch {
    next(new UnauthorizedError('Необходима авторизация!!!'));
  }
  req.user = payload;

  next();
};
