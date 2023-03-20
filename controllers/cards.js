const Card = require('../models/card');

const { CREATED_CODE } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
// const { ServerError } = require('../errors/ServerError');

// GET /cards
const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    // .catch(() => {
    // res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
    // throw new ServerError('Ошибка на стороне сервера');
    // });
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
        // res.status(BAD_REQUEST_CODE).send(validationErrorMessage);
        throw next(new BadRequestError('Ошибка валидации'));
      // } else {
      //   // res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
      //   throw next(new ServerError('Ошибка на стороне сервера'));
      // }
      } else throw next(err);
    });
};

// DELETE /cards/:cardId
const deleteCard = (req, res, next) => {
  console.log(req.params.cardId);
  // console.log('req.params.cardId:', req.params.cardId, 'req.user._id:', req.user._id);
  Card.findById(req.params.cardId)
    .then(
      (card) => {
        console.log('CARD:', card);
        if (!card) {
          throw new NotFoundError('Карточка не найдена');
        }

        if (req.params.cardId.owner !== req.user._id) {
          throw new ForbiddenError('Недостаточно прав');
        }
        // res.send(card);
        Card.findByIdAndRemove(req.params.cardId)
          .then((deletedCard) => res.send(deletedCard))
          .catch(next);
      },
    )
    .catch((err) => {
      if (err.name === 'CastError') {
        throw next(new BadRequestError('Некорректный id карточки'));
      } else next(err);
    });
  // .catch(next);
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
        // res.status(NOT_FOUND_CODE).send(cardNotFoundMessage);
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        // res.status(BAD_REQUEST_CODE).send(incorrectCardIdMessage);
        throw next(new BadRequestError('Некорректный id карточки'));
      // } else {
      //   // res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
      //   throw next(new ServerError('Ошибка на стороне сервера'));
      // }
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
        // res.status(NOT_FOUND_CODE).send(cardNotFoundMessage);
        throw new NotFoundError('Карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(BAD_REQUEST_CODE).send(incorrectCardIdMessage);
        throw next(new BadRequestError('Некорректный id карточки'));
      // } else {
      //   // res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
      //   throw new ServerError('Ошибка на стороне сервера');
      // }
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
