const { celebrate, Joi } = require('celebrate');

const picRegExp = /^(https?:\/\/)?(www\.)?(([\w-]{1,}\.){1,})[^\s@]*.$/m;

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(picRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const userInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const userAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(picRegExp),
  }),
});

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(picRegExp),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  signinValidation,
  signupValidation,
  userIdValidation,
  userInfoValidation,
  userAvatarValidation,
  cardValidation,
  cardIdValidation,
};
