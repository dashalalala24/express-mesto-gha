const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  CREATED_CODE,
  SECRET_KEY,
  // BAD_REQUEST_CODE,
  //   UNAUTHORIZED_CODE,
  //   NOT_FOUND_CODE,
  // CONFLICT_CODE,
  // SERVER_ERROR_CODE,
  // validationErrorMessage,
  // serverErrorMessage,
  //   unauthorizedErrorMessage,
  //   userNotFoundMessage,
  //   incorrectUserIdMessage,
  // conflictErrorMessage,
} = require('../utils/constants');

const BadRequest = require('../errors/BadRequest');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ServerError = require('../errors/ServerError');

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then(
      (hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }),
    )
    .then((user) => res.status(CREATED_CODE).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      console.log(err.code, err.keyPattern, err.keyValue);
      if (err.code === 11000) {
        // res.status(CONFLICT_CODE).send(conflictErrorMessage);
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } if (err.name === 'ValidationError') {
        // res.status(BAD_REQUEST_CODE).send(validationErrorMessage);
        next(new BadRequest('Ошибка валидации'));
      // } if {
        // res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
        // next(new ServerError('Ошибка на стороне сервера'));
        // next(err);
      } else next(err);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        // res.status(NOT_FOUND_CODE).send(userNotFoundMessage);
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      console.log(err.message, err.name);
      if (err.name === 'CastError') {
        // res.status(BAD_REQUEST_CODE).send(incorrectUserIdMessage);
        throw new BadRequest('Некорректный id пользователя');
      // } else {
        // res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
        // throw new ServerError('Ошибка на стороне сервера');
      } else next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  console.log(req.user);
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (userId == null) {
        console.log(userId, ': id юзера');
        // res.status(NOT_FOUND_CODE).send(userNotFoundMessage);
        throw new NotFoundError('Пользователь не найден');
      }
      console.log(userId);
      res.send(user);
    })
    // .catch((err) => {
    //   console.log(err.message, err.name);
    //   // res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
    //   throw new ServerError('Ошибка на стороне сервера');
    // })
    .catch(next);
};

const updateUser = (req, res, data) => {
  User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((newUserInfo) => res.send(newUserInfo))
    .catch((err) => {
      if (err.message === 'NotFound') {
        // res.status(NOT_FOUND_CODE).send(userNotFoundMessage);
        throw new NotFoundError('Пользователь не найден');
      }
      if (err.name === 'ValidationError') {
        // res.status(BAD_REQUEST_CODE).send(validationErrorMessage);
        throw new BadRequest('Ошибка валидации');
      } else {
        // res.status(SERVER_ERROR_CODE).send(serverErrorMessage);
        throw new ServerError('Ошибка на стороне сервера');
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

const login = (req, res, next) => {
  // const { email, password } = req.body;

  // return User.findUserByCredentials(email, password)
  //   .then((user) => {
  //     const token = jwt.sign(
  //       { _id: user._id },
  //       SECRET_KEY,
  //       { expiresIn: '7d' },
  //     );

  //     res.cookie('jwt', token, {
  //       maxAge: 3600000 * 24 * 7,
  //       httpOnly: true,
  //     });

  //     res.send({ token });
  //   })
  //   .catch((err) => {
  //     console.log(err.message, err.name);
  //     console.log(res);
  //     // res.status(UNAUTHORIZED_CODE).send(unauthorizedErrorMessage);
  //     throw new UnauthorizedError('Ошибка авторизации');
  //   });

  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user || !password) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 7,
        httpOnly: true,
      });
      // return res.send({ token });
      res.send({ token });
    })
    .catch(next);
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
