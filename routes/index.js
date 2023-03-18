const router = require('express').Router();
const { NOT_FOUND_CODE, pageNotFoundMessage } = require('../utils/constants');
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use(userRouter);
router.use(cardRouter);

router.use('*', (req, res, next) => {
  next(res.status(NOT_FOUND_CODE).send(pageNotFoundMessage));
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
