const Card = require('../models/card');

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log(err.name, err.message);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(err.message, err.name);
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Не удалось найти карточку' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(err.message, err.name);
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Не удалось найти карточку' });
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(err.message, err.name);
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Не удалось найти карточку' });
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
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
