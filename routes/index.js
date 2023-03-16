const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use(userRouter);
router.use(cardRouter);
// router.use('*', (req, res, next) => {
//   next(new NotFoundError('Запрашиваемый ресурс не найден'));
// });

module.exports = router;
