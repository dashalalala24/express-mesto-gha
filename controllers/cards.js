const mongoose = require('mongoose');

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
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Ошибка валидации'));
      } return next(err);
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
        Card.deleteOne({ _id: cardId })
          .then((result) => res.send(result))
          .catch(next);
      },
    )
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Некорректный id карточки'));
      } return next(err);
    });
};

const handleLike = (req, res, next, option) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    option,
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Некорректный id карточки'));
      } return next(err);
    });
};

// PUT /cards/:cardId/likes
const putLike = (req, res, next) => {
  handleLike(req, res, next, { $addToSet: { likes: req.user._id } });
};

// DELETE /cards/:cardId/likes
const deleteLike = (req, res, next) => {
  handleLike(req, res, next, { $pull: { likes: req.user._id } });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
