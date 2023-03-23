const router = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');

const userRouter = require('./users');
const cardRouter = require('./cards');

const { createUser, login } = require('../controllers/users');

const { auth } = require('../middlewares/auth');
const { signupValidation, signinValidation } = require('../middlewares/validation');

router.post('/signup', signupValidation, createUser);

router.post('/signin', signinValidation, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
