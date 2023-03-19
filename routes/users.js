const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  // createUser,
  updateUserInfo,
  updateUserAvatar,
  // login,
} = require('../controllers/users');
// const auth = require('../middlewares/auth');

// router.post('/signup', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string().regex(/^(https?:\/\/)?(www\.)?(([\w-]{1,}\.){1,})[^\s@]*.$/m),
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//   }),
// }), createUser);

// router.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//   }),
// }), login);

// router.use(auth);

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?:\/\/)?(www\.)?(([\w-]{1,}\.){1,})[^\s@]*$/m),
  }),
}), updateUserAvatar);

router.use(errors());

module.exports = router;
