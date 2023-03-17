const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  CREATED_CODE,
  BAD_REQUEST_CODE,
  UNAUTHORIZED_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  validationErrorMessage,
  serverErrorMessage,
  unauthorizedErrorMessage,
  userNotFoundMessage,
  incorrectUserIdMessage,
} = require('../utils/constants');

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED_CODE).send({ data: user }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send(validationErrorMessage);
      } else {
        res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR_CODE).send(serverErrorMessage));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        res.status(NOT_FOUND_CODE).send(userNotFoundMessage);
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      console.log(err.message, err.name);
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send(incorrectUserIdMessage);
      } else {
        res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
      }
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        res.status(NOT_FOUND_CODE).send(userNotFoundMessage);
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      console.log(err.message, err.name);
      res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
    });
};

const updateUser = (req, res, data) => {
  User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((newUserInfo) => res.send(newUserInfo))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(NOT_FOUND_CODE).send(userNotFoundMessage);
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send(validationErrorMessage);
      } else {
        res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });

      res.send({ token });
    })
    .catch((err) => {
      console.log(err.message, err.name);
      res.status(UNAUTHORIZED_CODE).send(unauthorizedErrorMessage);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
};
