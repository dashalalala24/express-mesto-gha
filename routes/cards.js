const router = require('express').Router();

const { cardValidation, cardIdValidation } = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', cardValidation, createCard);

router.delete('/:cardId', cardIdValidation, deleteCard);

router.put('/:cardId/likes', cardIdValidation, putLike);

router.delete('/:cardId/likes', cardIdValidation, deleteLike);

module.exports = router;
