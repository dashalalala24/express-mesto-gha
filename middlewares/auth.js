// const token = require('jsonwebtoken');

// const { NODE_ENV, JWT_SECRET } = process.env;
// const UnauthorizedError = require('../errors/UnauthorizedError');

// module.exports.auth = (req, res, next) => {
//   console.log('req.headers из auth:', req.cookies);

//   // if (!req.headers.cookie) {
//   //   throw new UnauthorizedError('Необходима авторизация, нет кук в хедерс');
//   // }

//   // const { cookie } = req.headers;
//   // const token = cookie.replace('jwt=', '');
//   // let payload;
//   // try {
//   //   payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
//   //   console.log('payload из auth:', payload);
//   // } catch {
//   //   next(new UnauthorizedError('Необходима авторизация!!!'));
//   // }
//   // req.user = payload;

//   // next();

//   if (!req.cookies) {
//     throw new UnauthorizedError('Необходима авторизация, нет кук в рек');
//   }

//   const { jwt } = req.cookies;
//   if (!token) {
//     next(new UnauthorizedError('Нужно авторизоваться'));
//   }
//   // const token = jwt.replace('jwt=', '');
//   let payload;
//   try {
//     payload = token.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
//     console.log('payload из auth:', payload);
//   } catch {
//     next(new UnauthorizedError('Необходима авторизация!!!'));
//   }
//   req.user = payload;

//   next();
// };

const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('не пришло authorization в auth'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    console.log('payload из auth:', payload);
  } catch {
    next(new UnauthorizedError('в auth не записался payload'));
  }

  req.user = payload;

  next();
};
