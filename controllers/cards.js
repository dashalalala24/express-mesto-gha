const Card = require('../models/card');

const { CREATED_CODE } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// GET /cards
const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// POST /cards
const createCard = (req, res, next) => {
  const owner = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw next(new BadRequestError('Ошибка валидации'));
      } else throw next(err);
    });
};

// DELETE /cards/:cardId
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then(
      (card) => {
        if (!card) {
          throw new NotFoundError('Карточка не найдена');
        }

        if (card.owner._id.toString() !== req.user._id) {
          throw new ForbiddenError('Недостаточно прав');
        }
        Card.findByIdAndRemove(cardId)
          .then((deletedCard) => res.send(deletedCard))
          .catch(next);
      },
    )
    .catch((err) => {
      if (err.name === 'CastError') {
        throw next(new BadRequestError('Некорректный id карточки'));
      } else next(err);
    });
};

// PUT /cards/:cardId/likes
const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw next(new BadRequestError('Некорректный id карточки'));
      } else next(err);
    });
};

// DELETE /cards/:cardId/likes
const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw next(new BadRequestError('Некорректный id карточки'));
      } else next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
