const router = require('express').Router();
const { NOT_FOUND_CODE, pageNotFoundMessage } = require('../utils/constants');
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use(userRouter);
router.use(cardRouter);

router.use('*', (req, res, next) => {
  next(res.status(NOT_FOUND_CODE).send(pageNotFoundMessage));
});

module.exports = router;
