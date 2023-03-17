const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);
router.use(auth);
router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
