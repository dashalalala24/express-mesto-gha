const router = require('express').Router();

const { errors } = require('celebrate');

const { userIdValidation, userInfoValidation, userAvatarValidation } = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIdValidation, getUserById);

router.patch('/me', userInfoValidation, updateUserInfo);

router.patch('/me/avatar', userAvatarValidation, updateUserAvatar);

router.use(errors());

module.exports = router;
