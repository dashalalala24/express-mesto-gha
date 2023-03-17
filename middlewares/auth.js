const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_CODE, unauthorizedErrorMessage } = require('../utils/constants');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  // const { authorization } = req.headers;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   console.log(req.headers);
  //   return res.status(UNAUTHORIZED_CODE).send({ message: 'да епта' });
  // }

  // // const token = authorization.replace('Bearer ', '');
  const token = req.headers.cookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(UNAUTHORIZED_CODE).send(unauthorizedErrorMessage);
  }

  req.user = payload;

  next();
};

module.exports = auth;
