const Card = require('../models/card');

const {
  CREATED_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  validationErrorMessage,
  serverErrorMessage,
  cardNotFoundMessage,
  incorrectCardIdMessage,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR_CODE).send(serverErrorMessage));
};

const createCard = (req, res) => {
  const owner = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send(validationErrorMessage);
      } else {
        res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card == null) {
        res.status(NOT_FOUND_CODE).send(cardNotFoundMessage);
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send(incorrectCardIdMessage);
      } else {
        res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
      }
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        res.status(NOT_FOUND_CODE).send(cardNotFoundMessage);
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send(incorrectCardIdMessage);
      } else {
        res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        res.status(NOT_FOUND_CODE).send(cardNotFoundMessage);
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send(incorrectCardIdMessage);
      } else {
        res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
