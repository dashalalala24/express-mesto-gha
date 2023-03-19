const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// const { NOT_FOUND_CODE, pageNotFoundMessage } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const userRouter = require('./users');
const cardRouter = require('./cards');

const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?(www\.)?(([\w-]{1,}\.){1,})[^\s@]*.$/m),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(auth);

router.use(userRouter);
router.use(cardRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// router.use((err, req, res) => {
//   const { statusCode = 500 } = err;

//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === 500
//         ? 'Выставилось 500'
//         : 'Че-то другое',
//     });
// });

module.exports = router;
