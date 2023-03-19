const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');

const { UnauthorizedError } = require('../errors/UnauthorizedError');

// // eslint-disable-next-line consistent-return
// const auth = (req, res, next) => {
//   const authorization = req.headers.cookie;
//   console.log(req)
//   // if (!authorization || !authorization.startsWith('Bearer ')) {
//   //   console.log(req.headers);
//   //   return res.status(UNAUTHORIZED_CODE).send({ message: 'да епта' });
//   // }
//   // console.log(req.headers, req.body);
//   // // const token = authorization.replace('Bearer ', '');
//   // const token = req.headers.cookie.replace('jwt=', '');
//   // const token = req.headers.cookie.jwt;

//   // try {
//   //   const token = req.headers.cookie.replace('jwt=', '');
//   //   payload = jwt.verify(token, SECRET_KEY);
//   //   console.log('токен', token, 'записался');
//   // } catch (err) {
//   //   // console.log(req.headers);
//   //   // return res.status(UNAUTHORIZED_CODE).send(unauthorizedErrorMessage);
//   //   next(new UnauthorizedError('Ошибка авторизации 444'));
//   //   return;
//   //   // res.status(403).send(" да где ты сломалось??");
//   // }

//   if (!authorization) {
//     console.log(req);
//     throw new UnauthorizedError('Ошибка авторизации 555');
//     //   return res.status(UNAUTHORIZED_CODE).send({ message: 'да епта' });
//   }
//   const token = req.headers.cookie.replace('jwt=', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, SECRET_KEY);
//     console.log('токен', token, 'записался');
//   } catch (err) {
//     // console.log(req.headers);
//     // return res.status(UNAUTHORIZED_CODE).send(unauthorizedErrorMessage);
//     next(new UnauthorizedError('Ошибка авторизации 444'));
//     return;
//     // res.status(403).send(" да где ты сломалось??");
//   }
//   req.user = payload;

//   next();
// };

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
