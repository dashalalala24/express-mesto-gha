const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  console.log('req.headers из auth back', req.headers);

  if (!req.headers.cookie) {
    throw new UnauthorizedError('Необходима авторизация, нет кук в хедерс');
  }

  if (!req.headers.authorization) {
    throw new UnauthorizedError('Необходима авторизация, нет authorization в хедерс');
  }

  if (req.headers.authorization) {
    console.log('authorization в хедерс:', req.headers.authorization);
  }
  const { cookie } = req.headers;
  // const { authorization } = req.headers;
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
