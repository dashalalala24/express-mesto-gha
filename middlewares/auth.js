const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');

const { UnauthorizedError } = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  // const { authorization } = req.headers;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   console.log(req.headers);
  //   return res.status(UNAUTHORIZED_CODE).send({ message: 'да епта' });
  // }
  console.log(req.headers, req.body);
  // // const token = authorization.replace('Bearer ', '');
  const token = req.headers.cookie.replace('jwt=', '');
  // const token = req.headers.cookie.jwt;
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    // console.log(req.headers);
    // return res.status(UNAUTHORIZED_CODE).send(unauthorizedErrorMessage);
    throw new UnauthorizedError('Ошибка авторизации');
  }

  req.user = payload;

  next();
};

module.exports = auth;
