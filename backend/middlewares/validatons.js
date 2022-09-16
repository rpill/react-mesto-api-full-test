const { Joi, celebrate } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const urlRegExp = new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$');

// валидация id
const validateObjId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

// валидация карточки.
// name и link - обязательные поля, name - от 2 до 30 символов, link - валидный url
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'string.empty': 'Поле "name" должно быть заполнено',
      }),
    link: Joi.string().required().pattern(urlRegExp)
      .message('Поле "avatar" должно быть валидным url-адресом')
      .messages({
        'string.empty': 'Поле "link" должно быть заполнено',
      }),
  }),
});

// валидация пользователя.
// name, about и avatar - необязательные. name, about - от 2 до 30 символов, avatar - валидный url
// password, email - обязательные, email - валидный email
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2',
        'string.max': 'Максимальная длина поля "about" - 30',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Поле "password" должно быть заполнено',
      }),
    email: Joi.string().required().email()
      .message('Поле "email" должно быть валидным email-адресом')
      .messages({
        'string.empty': 'Поле "email" должно быть заполнено',
      }),
    avatar: Joi.string()
      .pattern(urlRegExp)
      .message('Поле "avatar" должно быть валидным url-адресом'),
  }),
});

// валидация логина.
// password, email - обязательные, email - валидный email
const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле "email" должно быть валидным email-адресом')
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Поле "password" должно быть заполнено',
      }),
  }),
});

// валидация аватарки.
// avatar - обязательный, валидный url
const validateAvatar = celebrate({
  body: {
    avatar: Joi.string().required().pattern(urlRegExp)
      .message('Поле "avatar" должно быть валидным url-адресом')
      .messages({
        'string.empty': 'Поле "avatar" должно быть заполнено',
      }),
  },
});

// валидация профиля.
// name, about - обязательные, от 2 до 30 символов
const validateProfile = celebrate({
  body: {
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'string.empty': 'Поле "name" должно быть заполнено',
      }),
    about: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2',
        'string.max': 'Максимальная длина поля "about" - 30',
        'string.empty': 'Поле "about" должно быть заполнено',
      }),
  },
});

module.exports = {
  urlRegExp,
  validateObjId,
  validateCardBody,
  validateUserBody,
  validateAuthentication,
  validateAvatar,
  validateProfile,
};
